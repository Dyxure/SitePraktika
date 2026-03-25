import { useState, useEffect } from 'react'
import { brand, navItems } from '../content/siteData'

export default function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Отслеживаем скролл для добавления тени
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Плавный скролл к якорям
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      })
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <>
      <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          {/* Логотип */}
          <a href="#top" className="header-logo" aria-label={brand.name}>
            <img src="/image/лого 2.svg" alt={brand.name} className="logo-image" />
          </a>

          {/* Десктопная навигация */}
          <nav className="header-nav desktop-nav">
            {navItems.map((item) => (
              <a
                key={item.to}
                href={item.to}
                onClick={(e) => scrollToSection(e, item.to)}
                className="nav-link"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Кнопка мобильного меню */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Открыть меню"
            aria-expanded={isMobileMenuOpen}
          >
            <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        {/* Мобильное меню */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <nav className="mobile-nav">
            {navItems.map((item) => (
              <a
                key={item.to}
                href={item.to}
                onClick={(e) => scrollToSection(e, item.to)}
                className="mobile-nav-link"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Отступ для фиксированного хедера */}
      <div className="header-offset" />
    </>
  )
}