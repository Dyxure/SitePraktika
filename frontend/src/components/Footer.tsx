import { contact } from '../content/siteData'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="flex-row-wrap-center justify-between">
          <div className="fw-800">Земля Искусства</div>
          <div className="text-muted">
            {contact.address} · {contact.phone}
          </div>
        </div>
        <div className="mt-10">
          <a href="/contacts">
            Контакты
          </a>
        </div>
      </div>
    </footer>
  )
}

