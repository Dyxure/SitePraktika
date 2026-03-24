import { contact } from '../content/siteData'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="flex-row-wrap-center justify-between">
          <div className="fw-800">Земля Искусства</div>
          <div className="text-muted">
             · {contact.phone}
          </div>
        </div>
        <div className="mt-10">
          <img src="/images/logo.png" alt="Logo" />
          <a href="#contacts">
            Политика конфиденциальности
          </a>
        </div>
      </div>
    </footer>
  )
}

