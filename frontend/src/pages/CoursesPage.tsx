import { courses } from '../content/siteData'

export default function CoursesPage() {
  return (
    <section className="section">
      <h2 className="section-title">Курсы</h2>
      <div className="grid-3">
        {courses.map((c) => (
          <div className="card" key={c.title}>
            <h3>{c.title}</h3>
              <p className="text-muted">
                <b>{c.level}</b> · {c.time}
              </p>
            <p>{c.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

