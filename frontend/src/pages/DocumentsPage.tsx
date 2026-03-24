import { documents } from '../content/siteData'

export default function DocumentsPage() {
  return (
    <section className="section">
      <h2 className="section-title">Документы / Сертификаты</h2>
      <div className="list">
        {documents.map((d) => (
          <div className="list-item" key={d.title}>
            <b className="fs-16">{d.title}</b>
            <div className="mt-8 text-muted lh-16">{d.text}</div>
          </div>
        ))}
      </div>
      <div className="hint mt-12">
        Здесь можно разместить ссылки на PDF/вложения из старого сайта.
      </div>
    </section>
  )
}

