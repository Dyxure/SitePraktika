import { brand, directions, home, teachers } from '../content/siteData'
import { NavLink } from 'react-router-dom'

function PreviewCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-card">
            <div className="hero-card-inner">
              <div className="kicker">
                <span className="kicker-dot" />
                {home.heroKicker}
              </div>
              <h1 className="h1">{home.heroTitle}</h1>
              <p className="lead">{home.heroLead}</p>
              <div className="cta-row">
                <NavLink className="btn btn-primary" to="/apply/learning">
                  Записаться на обучение
                </NavLink>
                <NavLink className="btn btn-good" to="/competition">
                  Подробнее о конкурсе
                </NavLink>
              </div>
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-side">
              <div className="side-title">Почему родители выбирают {brand.name}</div>
              <div className="points">
                {home.advantages.map((a) => (
                  <div className="point" key={a.title}>
                    <b>{a.title}</b>
                    <span>{a.text}</span>
                  </div>
                ))}
              </div>
              <div className="hint mt-2">Сайт создан для простых заявок: отправка идёт на email и в Telegram.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Направления обучения</h2>
        <div className="grid-3">
          {directions.map((d) => (
            <PreviewCard key={d.title} title={d.title} description={d.description} />
          ))}
        </div>
        <div className="mt-14">
          <NavLink className="btn" to="/directions">
            Все направления
          </NavLink>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Кто учит</h2>
        <div className="grid-3">
          {teachers.map((t) => (
            <div className="card" key={t.name}>
              <h3>{t.name}</h3>
              <p>
                <b>{t.spec}</b>
              </p>
              <p>{t.bio}</p>
            </div>
          ))}
        </div>
        <div className="mt-14">
          <NavLink className="btn" to="/teachers">
            Все преподаватели
          </NavLink>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Заявка за 1 минуту</h2>
        <div className="card">
          <p>
            Оставьте заявку на обучение или подайте заявку на конкурс. Мы свяжемся с вами по контактам, указанным в форме.
          </p>
          <div className="cta-row mt-14">
            <NavLink className="btn btn-primary" to="/apply/learning">
              Записаться
            </NavLink>
            <NavLink className="btn btn-good" to="/apply/competition">
              Подать заявку на конкурс
            </NavLink>
          </div>
        </div>
      </section>
    </>
  )
}

