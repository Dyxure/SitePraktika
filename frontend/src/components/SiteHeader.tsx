// Шапка лендинга: бренд, якорная навигация и CTA-кнопки.
import { brand, navItems } from '../content/siteData'

export default function SiteHeader() {
  return (
    <div className="topbar-inner">
      <a href="#top" className="brand" aria-label={brand.name}>
        <div className="brand-mark" />
        <div>{brand.name}</div>
      </a>

      <nav className="nav" aria-label="Навигация">
        {navItems.map((item) => (
          <a key={item.to} href={item.to}>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="cta-row">
        <a className="btn btn-primary" href="#apply-learning">
          Записаться
        </a>
        <a className="btn btn-good" href="#apply-competition">
          На конкурс
        </a>
      </div>
    </div>
  )
}

