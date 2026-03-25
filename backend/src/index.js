const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const nodemailer = require('nodemailer')
const { z } = require('zod')
const path = require('path')
const fs = require('fs')

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

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

async function sendEmail({ subject, text }) {
  if (!hasEmailConfig()) return { skipped: true }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: String(process.env.SMTP_SECURE ?? 'false') === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const toList = process.env.EMAIL_TO.split(',').map((s) => s.trim()).filter(Boolean)

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: toList,
    subject,
    text,
  })

  return { skipped: false }
}

async function sendTelegramMessage({ text }) {
  if (!hasTelegramConfig()) return { skipped: true }
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  const url = `https://api.telegram.org/bot${token}/sendMessage`
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    }),
  })

  return { skipped: false }
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

app.post('/api/forms/learning', async (req, res) => {
  try {
    const payload = learningSchema.parse(req.body)

    const text = learningToText(payload)
    const telegramText = `<b>Заявка на обучение</b>\n` + escapeHtml(text).replaceAll('\n', '<br/>')

    await Promise.all([
      sendEmail({ subject: 'Заявка на обучение · Земля Искусства', text }),
      sendTelegramMessage({ text: telegramText }),
    ])

    res.json({ ok: true })
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

    await Promise.all([
      sendEmail({ subject: 'Заявка на конкурс · Земля Искусства', text }),
      sendTelegramMessage({ text: telegramText }),
    ])

    res.json({ ok: true })
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

    await Promise.all([
      sendEmail({ subject: 'Заявка с сайта · Земля Искусства', text }),
      sendTelegramMessage({ text: telegramText }),
    ])

    res.json({ ok: true })
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

