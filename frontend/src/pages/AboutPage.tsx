import { brand } from '../content/siteData'

export default function AboutPage() {
  return (
    <section className="section">
      <h2 className="section-title">О проекте / О школе</h2>
      <div className="grid-3 about-grid">
        <div className="card">
          <h3>Кто мы</h3>
          <p>
            {brand.name} — образовательный проект и ремесленная школа, ориентированная на родителей, которые
            выбирают для детей творческое обучение и практику в ремесле.
          </p>
        </div>
        <div className="card">
          <h3>Первая ремесленная школа</h3>
          <p>Мы бережно соединяем смыслы, методику и ручную работу, чтобы ребёнок учился через создание.</p>
        </div>
        <div className="card">
          <h3>Лицензия и доверие</h3>
          <p>Документы и сертификаты вынесены в отдельный раздел — чтобы родителям было проще проверить информацию.</p>
        </div>
      </div>
    </section>
  )
}

