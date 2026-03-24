const works = [
  { src: "/image/works/бусы.svg", alt: "Работы учеников — народные мотивы и бусы" },
  { src: "/image/works/полка.svg", alt: "Работы учеников — полка с поделками" },
  { src: "/image/works/игрушки.svg", alt: "Работы учеников — глиняные фигурки" },
  { src: "/image/works/кувшинчик.svg", alt: "Работы учеников — керамика и кувшины" },
  { src: "/image/works/тарелки.svg", alt: "Работы учеников — посуда на стеллаже" },
  { src: "/image/works/еще игрушки.svg", alt: "Работы учеников — керамические игрушки" },
  { src: "/image/works/кукла.svg", alt: "Работы учеников — авторская кукла" },
];

export default function StudentsWorksSection() {
  return (
    <section className="students-works-section" id="students-works">
      <div className="students-works-container">
        <h2 className="students-works-title" id="students-works-heading">
          Работы наших учеников
        </h2>

        <div
          className="students-works-grid"
          aria-labelledby="students-works-heading"
        >
          {works.map((work, index) => (
            <div
              className={
                index === 1 ? "work-tile work-tile--featured" : "work-tile"
              }
              key={work.src}
            >
              <img src={work.src} alt={work.alt} loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
      </div>
      <div className="students-works-decor" aria-hidden="true">
        <span className="decor-item decor-pink decor-quarter-left" />
        <span className="decor-item decor-white" />
        <span className="decor-item decor-pink" />
        <span className="decor-item decor-green decor-half-left" />
        <span className="decor-item decor-pink decor-half-right" />
        <span className="decor-item decor-yellow decor-full" />
        <span className="decor-item decor-orange decor-half-right" />
        <span className="decor-item decor-pink" />
        <span className="decor-item decor-green" />
      </div>
    </section>
  );
}
