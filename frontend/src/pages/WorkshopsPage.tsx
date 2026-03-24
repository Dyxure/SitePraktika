import { workshops } from '../content/siteData'

export default function WorkshopsPage() {
  return (
    <section className="section">
      <h2 className="section-title">Мастер-классы</h2>
      <div className="list">
        {workshops.map((w) => (
          <div className="list-item" key={w.title}>
            <div className="workshop-title-row">
              <b className="fs-16">{w.title}</b>
              <span>{w.date}</span>
            </div>
            <div className="mt-8 text-muted lh-16">{w.text}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

