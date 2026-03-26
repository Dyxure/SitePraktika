const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const nodemailer = require('nodemailer')
const { z } = require('zod')
const path = require('path')
const fs = require('fs')
const net = require('net')

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({ limit: '1mb' }))

// Чтобы парсинг JSON не валил контейнер/логи огромными stack traces,
// а клиент получал понятную ошибку.
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ ok: false, error: 'Invalid JSON body' })
  }
  return next(err)
})

app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

// Диагностика: проверяем TCP-доступность SMTP-хоста/порта из среды Railway.
// Секреты (пароли) не возвращаем.
app.get('/api/debug/smtp', async (req, res) => {
  const host = process.env.SMTP_HOST ?? ''
  const port = Number(process.env.SMTP_PORT ?? 0)
  const from = process.env.EMAIL_FROM ?? ''
  const secureRaw = process.env.SMTP_SECURE ?? ''
  const secureNormalized = String(secureRaw).trim().toLowerCase()
  const secureByPort = port === 465
  const secure =
    secureNormalized !== ''
      ? secureNormalized === 'true' || secureNormalized === '1' || secureNormalized === 'yes'
      : secureByPort

  if (!host || !port) {
    return res.status(400).json({ ok: false, error: 'SMTP_HOST/SMTP_PORT not set' })
  }

  const timeoutMs = 5000
  const socket = new net.Socket()

  const connected = await new Promise((resolve) => {
    const onOk = () => {
      cleanup()
      resolve(true)
    }
    const onErr = () => {
      cleanup()
      resolve(false)
    }
    const cleanup = () => {
      socket.removeListener('connect', onOk)
      socket.removeListener('error', onErr)
      socket.removeListener('timeout', onErr)
      try {
        socket.destroy()
      } catch {}
    }

    socket.setTimeout(timeoutMs)
    socket.once('connect', onOk)
    socket.once('error', onErr)
    socket.once('timeout', onErr)
    socket.connect(port, host)
  })

  return res.json({
    ok: true,
    connected,
    host,
    port,
    secure,
    from,
    note: connected
      ? 'TCP connection works. Next step: check SMTP auth and STARTTLS/SSL settings.'
      : 'TCP connection failed. Likely wrong host/port or outbound SMTP blocked from Railway.',
  })
})

async function testSmtpTcp(host, port, timeoutMs) {
  if (!host || !port) return false
  const socket = new net.Socket()

  const connected = await new Promise((resolve) => {
    const onOk = () => {
      cleanup()
      resolve(true)
    }
    const onErr = () => {
      cleanup()
      resolve(false)
    }
    const cleanup = () => {
      try {
        socket.removeListener('connect', onOk)
        socket.removeListener('error', onErr)
        socket.removeListener('timeout', onErr)
      } catch {}
      try {
        socket.destroy()
      } catch {}
    }
    socket.setTimeout(timeoutMs)
    socket.once('connect', onOk)
    socket.once('error', onErr)
    socket.once('timeout', onErr)
    socket.connect(port, host)
  })

  return connected
}

// Если собранный фронтенд уже лежит в frontend/dist — раздаём его.
// Это удобно для деплоя одним сервисом (backend + статический сайт).
const distPath = path.join(__dirname, '../../frontend/dist')
try {
  app.use(express.static(distPath))
  const indexFile = path.join(distPath, 'index.html')
  // Fallback для SPA-роутинга:
  // любые фронтовые URL (кроме `/api/*`) отдаем `index.html`,
  // чтобы React Router смог отрендерить нужную страницу.
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) return next()
    if (!fs.existsSync(indexFile)) return next()
    res.sendFile(indexFile)
  })
} catch {
  // В dev-сценарии dist может отсутствовать — это не критично
}

function hasEmailConfig() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.EMAIL_FROM &&
      process.env.EMAIL_TO,
  )
}

function hasTelegramConfig() {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID)
}

// Таймауты нужны, чтобы SMTP успевал установить соединение и отправить письмо.
// Запрос к API в фронте не должен зависеть от уведомлений: они уходят в фоне.
// Даже если NOTIFY_TIMEOUT_MS случайно выставили слишком маленьким — принудительно увеличим.
const NOTIFY_TIMEOUT_MS_RAW = Number(process.env.NOTIFY_TIMEOUT_MS ?? 15000)
const NOTIFY_TIMEOUT_MS = Number.isFinite(NOTIFY_TIMEOUT_MS_RAW) ? Math.max(NOTIFY_TIMEOUT_MS_RAW, 15000) : 15000

async function withTimeout(promise, timeoutMs, label) {
  let timeoutId
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`${label} timeout after ${timeoutMs}ms`)), timeoutMs)
  })
  try {
    return await Promise.race([promise, timeoutPromise])
  } finally {
    clearTimeout(timeoutId)
  }
}

async function sendEmail({ subject, text, html, to }) {
  if (!hasEmailConfig()) {
    throw new Error('Email configuration is incomplete')
  }

  const smtpHost = process.env.SMTP_HOST
  const smtpPort = Number(process.env.SMTP_PORT)
  const smtpSecureRaw = process.env.SMTP_SECURE ?? ''
  const smtpSecureNormalized = String(smtpSecureRaw).trim().toLowerCase()
  // Если SMTP_SECURE не задан явно — ориентируемся на порт (465 обычно требует secure=true)
  const smtpSecure =
    smtpSecureNormalized !== ''
      ? smtpSecureNormalized === 'true' || smtpSecureNormalized === '1' || smtpSecureNormalized === 'yes'
      : smtpPort === 465

  const defaultToList = process.env.EMAIL_TO.split(',').map((s) => s.trim()).filter(Boolean)
  const toList = (Array.isArray(to) ? to : [to]).filter(Boolean)

  const finalTo = toList.length ? toList : defaultToList
  if (!finalTo.length) {
    throw new Error('Email recipient list is empty')
  }

  const firstRecipient = String(finalTo[0] ?? '').slice(0, 80)
  const tcpTimeoutMs = Math.min(5000, NOTIFY_TIMEOUT_MS)

  const candidates = []
  candidates.push({ port: smtpPort, secure: smtpSecure })
  if (smtpPort !== 465) candidates.push({ port: 465, secure: true })
  if (smtpPort !== 587) candidates.push({ port: 587, secure: false })

  // Убираем дубликаты кандидатов
  const seen = new Set()
  const uniqueCandidates = candidates.filter((c) => {
    const key = `${c.port}:${c.secure ? 1 : 0}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  let lastErr

  for (const candidate of uniqueCandidates) {
    const { port: attemptPort, secure: attemptSecure } = candidate

    try {
      const tcpOk = await testSmtpTcp(smtpHost, attemptPort, tcpTimeoutMs)
      if (!tcpOk) {
        lastErr = new Error(`SMTP TCP connection failed to ${smtpHost}:${attemptPort}`)
        continue
      }

      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: attemptPort,
        secure: attemptSecure,
        connectionTimeout: NOTIFY_TIMEOUT_MS,
        greetingTimeout: NOTIFY_TIMEOUT_MS,
        socketTimeout: NOTIFY_TIMEOUT_MS,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })

      await withTimeout(
        transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: finalTo,
          subject,
          text,
          html,
        }),
        NOTIFY_TIMEOUT_MS,
        `email send to ${firstRecipient} via ${smtpHost}:${attemptPort} secure=${attemptSecure}`,
      )

      return { ok: true }
    } catch (err) {
      lastErr = err
      const msg = err instanceof Error ? err.message : String(err)
      console.error('SMTP candidate failed:', {
        host: smtpHost,
        port: attemptPort,
        secure: attemptSecure,
        recipient: firstRecipient,
        error: msg,
      })
    }
  }

  throw lastErr ?? new Error('SMTP send failed')
}

async function sendTelegramMessage({ text }) {
  if (!hasTelegramConfig()) return { skipped: true }
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  const url = `https://api.telegram.org/bot${token}/sendMessage`
  const abortController = new AbortController()
  const abortId = setTimeout(() => abortController.abort(), NOTIFY_TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
      }),
      signal: abortController.signal,
    })
    if (!res.ok) {
      const bodyText = await res.text().catch(() => '')
      throw new Error(`Telegram API error: ${res.status} ${bodyText}`.trim())
    }
  } finally {
    clearTimeout(abortId)
  }

  return { skipped: false }
}

async function notifyOptional(tasks) {
  const results = await Promise.allSettled(tasks)
  const rejected = results.filter((r) => r.status === 'rejected')
  if (rejected.length) {
    for (const r of rejected) {
      console.error('Notification error:', r.reason instanceof Error ? r.reason.message : r.reason)
    }
  }
}

async function runWithRetry(fn, attempts = 2, delayMs = 300) {
  let lastError
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (i < attempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs))
      }
    }
  }
  throw lastError
}

function runNotificationTask(taskName, fn) {
  setImmediate(async () => {
    try {
      await fn()
    } catch (err) {
      console.error(`[notify:${taskName}]`, err instanceof Error ? err.message : err)
    }
  })
}

function escapeHtml(s) {
  return String(s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

// Схемы валидации позволяют отправлять формы: основные поля обязательные,
// но дополнительные поля не ломают отправку (удобно при правках дизайнером/контентом).
const learningSchema = z
  .object({
  parentName: z.string().min(1),
  parentPhone: z.string().min(1),
  childName: z.string().min(1),
  childAge: z.number().int().min(0),
  direction: z.string().min(1),
  comment: z.string().optional().nullable(),
  })
  .passthrough()

const competitionSchema = z
  .object({
  participantName: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  age: z.string().min(1),
  workTitle: z.string().min(1),
  additional: z.string().optional().nullable(),
  })
  .passthrough()

const bookingSchema = z
  .object({
  fullName: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  offerType: z.enum(['direction', 'workshop', 'course']),
  offerTitle: z.string().min(1),
  })
  .passthrough()

function learningToText(payload) {
  const lines = [
    `Заявка на обучение:`,
    `Родитель: ${payload.parentName} (${payload.parentPhone})`,
    `Ребёнок: ${payload.childName}, ${payload.childAge} лет`,
    `Направление: ${payload.direction}`,
  ]
  if (payload.comment && String(payload.comment).trim()) lines.push(`Комментарий: ${payload.comment}`)
  return lines.join('\n')
}

function competitionToText(payload) {
  const lines = [
    `Заявка на конкурс:`,
    `Участник/родитель: ${payload.participantName}`,
    `Телефон: ${payload.phone}`,
    `Email: ${payload.email}`,
    `Возраст/категория: ${payload.age}`,
    `Работа/номинация: ${payload.workTitle}`,
  ]
  if (payload.additional && String(payload.additional).trim()) lines.push(`Дополнительно: ${payload.additional}`)
  return lines.join('\n')
}

function competitionConfirmToText(payload) {
  return [
    `Здравствуйте, ${payload.participantName}!`,
    ``,
    `Спасибо за заявку на конкурс на сайте "Земля Искусства".`,
    `Мы получили ваши данные и скоро свяжемся с вами.`,
    ``,
    `Если вы не отправляли эту заявку, просто проигнорируйте письмо.`,
  ].join('\n')
}

const offerTypeLabels = {
  direction: 'Направление',
  workshop: 'Мастер-класс',
  course: 'Курс',
}

function bookingToText(payload) {
  const kind = offerTypeLabels[payload.offerType] ?? payload.offerType
  return [
    `Заявка с сайта:`,
    `Тип: ${kind}`,
    `Выбор: ${payload.offerTitle}`,
    `ФИО: ${payload.fullName}`,
    `Телефон: ${payload.phone}`,
    `Email: ${payload.email}`,
  ].join('\n')
}

function bookingConfirmToText(payload) {
  const kind = offerTypeLabels[payload.offerType] ?? payload.offerType
  return [
    `Здравствуйте, ${payload.fullName}!`,
    ``,
    `Спасибо за заявку на сайте "Земля Искусства".`,
    `Мы получили вашу заявку: ${kind} — ${payload.offerTitle}.`,
    `Наш менеджер свяжется с вами в ближайшее время по телефону или email.`,
    ``,
    `Если вы не оставляли эту заявку, просто проигнорируйте письмо.`,
  ].join('\n')
}

function bookingConfirmToHtml(payload) {
  const kind = escapeHtml(offerTypeLabels[payload.offerType] ?? payload.offerType)
  const fullName = escapeHtml(payload.fullName)
  const offerTitle = escapeHtml(payload.offerTitle)
  const phone = escapeHtml(payload.phone)
  const email = escapeHtml(payload.email)

  return `
  <div style="font-family:Arial,sans-serif;background:#f6f8fb;padding:24px;color:#1f2937;">
    <div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:12px;padding:24px;border:1px solid #e5e7eb;">
      <h2 style="margin:0 0 12px;color:#111827;">Заявка принята</h2>
      <p style="margin:0 0 14px;">Здравствуйте, <strong>${fullName}</strong>!</p>
      <p style="margin:0 0 14px;">Спасибо за заявку на сайте <strong>Земля Искусства</strong>.</p>
      <p style="margin:0 0 14px;">Мы получили вашу заявку и скоро свяжемся с вами.</p>
      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;margin:14px 0;">
        <p style="margin:0 0 6px;"><strong>Тип:</strong> ${kind}</p>
        <p style="margin:0 0 6px;"><strong>Выбор:</strong> ${offerTitle}</p>
        <p style="margin:0 0 6px;"><strong>Телефон:</strong> ${phone}</p>
        <p style="margin:0;"><strong>Email:</strong> ${email}</p>
      </div>
      <p style="margin:14px 0 0;color:#4b5563;">Если вы не оставляли эту заявку, просто проигнорируйте письмо.</p>
    </div>
  </div>`.trim()
}

function competitionConfirmToHtml(payload) {
  const fullName = escapeHtml(payload.participantName)
  const phone = escapeHtml(payload.phone)
  const email = escapeHtml(payload.email)
  const age = escapeHtml(payload.age)
  const workTitle = escapeHtml(payload.workTitle)

  return `
  <div style="font-family:Arial,sans-serif;background:#f6f8fb;padding:24px;color:#1f2937;">
    <div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:12px;padding:24px;border:1px solid #e5e7eb;">
      <h2 style="margin:0 0 12px;color:#111827;">Заявка на конкурс принята</h2>
      <p style="margin:0 0 14px;">Здравствуйте, <strong>${fullName}</strong>!</p>
      <p style="margin:0 0 14px;">Спасибо за участие в конкурсе от <strong>Земля Искусства</strong>.</p>
      <p style="margin:0 0 14px;">Мы получили вашу заявку и скоро с вами свяжемся.</p>
      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;margin:14px 0;">
        <p style="margin:0 0 6px;"><strong>ФИО:</strong> ${fullName}</p>
        <p style="margin:0 0 6px;"><strong>Возраст/категория:</strong> ${age}</p>
        <p style="margin:0 0 6px;"><strong>Работа/номинация:</strong> ${workTitle}</p>
        <p style="margin:0 0 6px;"><strong>Телефон:</strong> ${phone}</p>
        <p style="margin:0;"><strong>Email:</strong> ${email}</p>
      </div>
      <p style="margin:14px 0 0;color:#4b5563;">Если вы не отправляли эту заявку, просто проигнорируйте письмо.</p>
    </div>
  </div>`.trim()
}

app.post('/api/forms/learning', async (req, res) => {
  try {
    const payload = learningSchema.parse(req.body)

    const text = learningToText(payload)
    const telegramText = `<b>Заявка на обучение</b>\n` + escapeHtml(text).replaceAll('\n', '<br/>')

    res.json({ ok: true })
    runNotificationTask('learning', async () => {
      await runWithRetry(
        () => sendEmail({ subject: 'Заявка на обучение · Земля Искусства', text }),
        3,
        900,
      )
      // Telegram отправляем только если он настроен (sendTelegramMessage сам пропустит).
      await runWithRetry(() => sendTelegramMessage({ text: telegramText }), 2, 900)
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Ошибка'
    if (err?.name === 'ZodError') {
      return res.status(400).json({ ok: false, error: 'Проверьте поля формы', details: message })
    }
    return res.status(500).json({ ok: false, error: message })
  }
})

app.post('/api/forms/competition', async (req, res) => {
  try {
    const payload = competitionSchema.parse(req.body)

    const text = competitionToText(payload)
    const telegramText = `<b>Заявка на конкурс</b>\n` + escapeHtml(text).replaceAll('\n', '<br/>')

    res.json({ ok: true })
    runNotificationTask('competition', async () => {
      await runWithRetry(
        () => sendEmail({ subject: 'Заявка на конкурс · Земля Искусства', text }),
        3,
        900,
      )
      await runWithRetry(
        () =>
          sendEmail({
            subject: 'Мы получили вашу заявку на конкурс · Земля Искусства',
            text: competitionConfirmToText(payload),
            html: competitionConfirmToHtml(payload),
            to: payload.email,
          }),
        3,
        900,
      )
      await runWithRetry(() => sendTelegramMessage({ text: telegramText }), 2, 900)
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Ошибка'
    if (err?.name === 'ZodError') {
      return res.status(400).json({ ok: false, error: 'Проверьте поля формы', details: message })
    }
    return res.status(500).json({ ok: false, error: message })
  }
})

app.post('/api/forms/booking', async (req, res) => {
  try {
    const payload = bookingSchema.parse(req.body)

    const text = bookingToText(payload)
    const telegramText = `<b>Заявка (курс / МК / направление)</b>\n` + escapeHtml(text).replaceAll('\n', '<br/>')

    res.json({ ok: true })
    runNotificationTask('booking', async () => {
      await runWithRetry(
        () => sendEmail({ subject: 'Заявка с сайта · Земля Искусства', text }),
        3,
        900,
      )
      await runWithRetry(
        () =>
          sendEmail({
            subject: 'Мы получили вашу заявку · Земля Искусства',
            text: bookingConfirmToText(payload),
            html: bookingConfirmToHtml(payload),
            to: payload.email,
          }),
        3,
        900,
      )
      await runWithRetry(() => sendTelegramMessage({ text: telegramText }), 2, 900)
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Ошибка'
    if (err?.name === 'ZodError') {
      return res.status(400).json({ ok: false, error: 'Проверьте поля формы', details: message })
    }
    return res.status(500).json({ ok: false, error: message })
  }
})

const PORT = Number(process.env.PORT ?? 8080)
app.listen(PORT, () => {
  // Запуск HTTP сервера: API форм + (в проде) раздача frontend/dist
  console.log(`Backend listening on :${PORT}`)
})

