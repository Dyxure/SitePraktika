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
        <h2 className="students-works-title">Работы наших учеников</h2>

        <div className="students-works-grid">
          {works.map((work, index) => (
            <div
              className={
                index === 1 ? "work-tile work-tile--featured" : "work-tile"
              }
              key={work.src}
            >
              <img src={work.src} alt={work.alt} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
