import { contact } from '../content/siteData'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="flex-row-wrap-center justify-between">
        <div className="mt-10">
          <img src="/image/лого 2.svg" alt="Logo" />
          <a href="#contacts">
            Политика <br />конфиденциальности
          </a>
        </div>
        <div className="text-muted">
            <p>О нас</p>
            <p>Наши курсы</p>
          </div>
          <div className="text-muted">
            <p>Отзывы</p>
            <p>Контакты</p>
          </div>
          <div className="text-muted2">
             {contact.phone[0]} <br />
             {contact.phone[1]}
          </div>
        </div>
      </div>
    </footer>
  )
}

