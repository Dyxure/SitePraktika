import { directions } from '../content/siteData'

export default function DirectionsPage() {
  return (
    <section className="section">
      <h2 className="section-title">Направления обучения</h2>
      <div className="grid-3">
        {directions.map((d) => (
          <div className="card" key={d.title}>
            <h3>{d.title}</h3>
            <p>{d.description}</p>
              <p className="mt-10 text-muted">
                Визуально и структурно подойдёт контент с текущего сайта.
              </p>
          </div>
        ))}
      </div>
    </section>
  )
}

