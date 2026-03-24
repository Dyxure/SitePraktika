// Шапка сайта: бренд, меню и CTA-кнопки.
import { NavLink } from 'react-router-dom'
import { navItems } from '../content/siteData'

export default function SiteHeader() {
  return (
    <div className="topbar-inner">
      <NavLink to="/" className="brand" aria-label="Земля Искусства">
        <div className="brand-mark" />
        <div>Земля Искусства</div>
      </NavLink>

      <nav className="nav" aria-label="Навигация">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? 'navActive' : undefined)}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="cta-row">
        <NavLink className="btn btn-primary" to="/apply/learning">
          Записаться
        </NavLink>
        <NavLink className="btn btn-good" to="/apply/competition">
          На конкурс
        </NavLink>
      </div>
    </div>
  )
}

