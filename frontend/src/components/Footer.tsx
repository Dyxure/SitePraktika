import { contact } from '../content/siteData'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="flex-row-wrap-center justify-between">
        <div className="mt-10">
          <img src="/image/лого 2.svg" alt="Logo" />
          <a href="#">
            Политика <br />конфиденциальности
          </a>
        </div>
        <div className="text-muted">
            <p>
              <a href="#about">О нас</a>
            </p>
            <p>
              <a href="#courses">Наши курсы</a>
            </p>
          </div>
          <div className="text-muted">
            <p>
              <a href="#reviews">Отзывы</a>
            </p>
            <p>
              <a href="#contacts">Контакты</a>
            </p>
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

