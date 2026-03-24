import Footer from "./components/Footer";
import SiteHeader from "./components/SiteHeader";
import FormRenderer from "./components/FormRenderer";
import {
  competitionFormFields,
  learningFormFields,
} from "./content/formConfigs";
import {
  brand,
  competition,
  contact,
  courses,
  directions,
  documents,
  home,
  teachers,
  workshops,
} from "./content/siteData";
import {
  submitCompetition,
  submitLearning,
  type CompetitionPayload,
  type LearningPayload,
} from "./lib/api";

export default function App() {
  return (
    <div>
      <div className="topbar">
        <div className="container">
          <SiteHeader />
        </div>
      </div>

      <main className="container">
        <section className="hero" id="top">
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
                  <a className="btn btn-primary" href="#apply-learning">
                    Записаться на обучение
                  </a>
                  <a className="btn btn-good" href="#apply-competition">
                    Подать заявку на конкурс
                  </a>
                </div>
              </div>
            </div>

            <div className="hero-card">
              <div className="hero-side">
                <div className="side-title">Почему выбирают {brand.name}</div>
                <div className="points">
                  {home.advantages.map((item) => (
                    <div className="point" key={item.title}>
                      <b>{item.title}</b>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
                <div className="hint mt-2">{brand.subtitle}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="about">
          <h2 className="section-title">О школе</h2>
          <div className="card">
            <p>
              {brand.name} - творческая ремесленная школа в Тюмени для детей и
              родителей.
            </p>
            <p className="mt-10">
              Мы создаем безопасную среду, где можно пробовать, ошибаться,
              развиваться и создавать вещи своими руками.
            </p>
          </div>
        </section>

        <section className="section" id="directions">
          <h2 className="section-title">Направления</h2>
          <div className="grid-3">
            {directions.map((item) => (
              <div className="card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="teachers">
          <h2 className="section-title">Преподаватели</h2>
          <div className="grid-3">
            {teachers.map((teacher) => (
              <div className="card" key={teacher.name}>
                <h3>{teacher.name}</h3>
                <p>
                  <b>{teacher.spec}</b>
                </p>
                <p className="mt-8">{teacher.bio}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="competition">
          <h2 className="section-title">{competition.title}</h2>
          <div className="card">
            <p>{competition.lead}</p>
          </div>
        </section>

        <section className="section" id="documents">
          <div className="grid-3">
            {documents.map((doc) => (
              <div className="card" key={doc.title}>
                {doc.text.endsWith(".png") ||
                doc.text.endsWith(".jpg") ||
                doc.text.endsWith(".jpeg") ||
                doc.text.endsWith(".webp") ? (
                  <img
                    src={doc.text.replace("/public", "")}
                    alt={doc.title}
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                ) : (
                  <p>{doc.text}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="workshops">
          <h2 className="section-title">Мастер-классы</h2>
          <div className="list">
            {workshops.map((workshop) => (
              <div className="list-item" key={workshop.title}>
                <div className="workshop-title-row">
                  <b>{workshop.title}</b>
                  <span>{workshop.date}</span>
                </div>
                <p className="mt-8">{workshop.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="courses">
          <h2 className="section-title">Курсы</h2>
          <div className="grid-3">
            {courses.map((course) => (
              <div className="card" key={course.title}>
                <h3>{course.title}</h3>
                <p>
                  <b>{course.level}</b> - {course.time}
                </p>
                <p className="mt-8">{course.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="contacts">
          <h2 className="section-title">Контакты</h2>
          <div className="card">
            <p>{contact.address}</p>
            <p className="mt-8">{contact.phone}</p>
            <p className="mt-8">
              Telegram: <a href={contact.telegramUrl}>@terraarte</a>
            </p>
          </div>
        </section>

        <section className="section" id="apply-learning">
          <FormRenderer<LearningPayload>
            title="Запись на обучение"
            fields={learningFormFields}
            submitText="Отправить заявку"
            hint="Оставьте контакты, мы свяжемся с вами и подберем удобное расписание."
            onSubmit={async (payload) => {
              await submitLearning(payload);
            }}
          />
        </section>

        <section className="section" id="apply-competition">
          <FormRenderer<CompetitionPayload>
            title="Заявка на конкурс"
            fields={competitionFormFields}
            submitText="Подать заявку"
            hint="После отправки мы свяжемся для подтверждения участия."
            onSubmit={async (payload) => {
              await submitCompetition(payload);
            }}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
