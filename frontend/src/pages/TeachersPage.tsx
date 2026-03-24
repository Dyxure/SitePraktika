import { teachers } from '../content/siteData'

export default function TeachersPage() {
  return (
    <section className="section">
      <h2 className="section-title">Преподаватели</h2>
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
    </section>
  )
}

