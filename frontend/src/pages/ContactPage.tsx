import { contact } from '../content/siteData'

export default function ContactPage() {
  return (
    <section className="section">
      <h2 className="section-title">Контакты</h2>
      <div className="grid-3">
        <div className="card">
          <h3>Адрес</h3>
          <p>{contact.address}</p>
        </div>
        <div className="card">
          <h3>Телефон</h3>
          <p>{contact.phone}</p>
        </div>
        <div className="card">
          <h3>Telegram</h3>
          <p>
            <a href={contact.telegramUrl} target="_blank" rel="noreferrer">
              Перейти в Telegram
            </a>
          </p>
          <p className="mt-8 text-muted">Если удобнее — пишите в мессенджер.</p>
        </div>
      </div>
      <div className="hint mt-12">
        По желанию можно добавить карту (Google/Яндекс) — но это не обязательно для заявки.
      </div>
    </section>
  )
}

