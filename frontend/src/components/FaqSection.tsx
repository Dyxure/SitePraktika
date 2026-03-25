const faqItems = [
  {
    question: "Нужно ли родителям присутствовать на занятии?",
    answer:
      "Присутствие родителей не обязательно, но возможно по вашему желанию. Для детей младшего возраста (5-9 лет) мы рекомендуем сопровождение.",
  },
  {
    question: "Безопасно ли работать с инструментами и материалами?",
    answer:
      "Да, все занятия проходят под присмотром преподавателя. Мы используем безопасные материалы, а перед началом объясняем правила работы.",
  },
  {
    question: "С какого возраста ребенок может заниматься по вашим курсам?",
    answer:
      "Основные программы подходят детям от 5 лет. Конкретный возраст зависит от курса, сложности и формата занятия.",
  },
  {
    question: "Как записаться и сколько стоит занятие?",
    answer:
      "Оставьте заявку через форму на сайте или напишите нам в мессенджер. Стоимость зависит от выбранного курса и длительности занятий.",
  },
];

export default function FaqSection() {
  return (
    <section className="faq-section" id="faq">
      <div className="faq-container">
        <h2 className="faq-title">Часто задаваемые вопросы</h2>

        <div className="faq-list">
          {faqItems.map((item, index) => (
            <details className="faq-item" key={item.question} open={index === 0}>
              <summary className="faq-question">{item.question}</summary>
              <p className="faq-answer">{item.answer}</p>
            </details>
          ))}
        </div>

        <div className="faq-cta">
          <p className="faq-cta-title">Подарите вашему ребёнку мир новых открытий!</p>
          <p className="faq-cta-title">
            Пройдите пробное БЕСПЛАТНОЕ занятие прямо сейчас!
          </p>
          <div className="faq-cta-actions">
            <a className="btn btn-primary" href="#contacts">
              Получить пробный урок
            </a>
            <a className="btn btn-outline" href="#directions">
              Выбрать курс
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
