import { useState } from "react";
import Footer from "./components/Footer";
import FaqSection from "./components/FaqSection";
import MapSection from "./components/MapSection";
import ReviewsSection from "./components/ReviewsSection";
import SiteHeader from "./components/SiteHeader";
import StudentsWorksSection from "./components/StudentsWorksSection";
import BookingModal, {
  type BookingOfferType,
} from "./components/BookingModal";
import { courses, directions, documents, workshops } from "./content/siteData";

export default function App() {
  const [booking, setBooking] = useState<{
    type: BookingOfferType;
    title: string;
  } | null>(null);

  return (
    <div>
      <SiteHeader />

      <main>
        <section className="hero" id="top">
          <img src="image/Group 15.png" alt="imag1" className="image" />
          <div className="homeJ">
            <p>- первая в Тюмени ремесленная школа "Земля искусства"</p>
          </div>
          <p className="homeP">
            Если ваш ребёнок любит творчество и вы хотите, чтобы он стал
            профессионалом в одном из ремесленных направлений – приглашаем в
            нашу школу!
          </p>
          <div className="b-container">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                setBooking({ type: "course", title: "Подбор курса" })
              }
            >
              Выбрать курс
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() =>
                setBooking({ type: "course", title: "Пробное занятие" })
              }
            >
              Получить пробный урок
            </button>
          </div>
        </section>

        <section className="section" id="AllCircles">
          <div className="containerCircle">
            <div className="text-content">
              <h1 className="title">Все наши кружки</h1>

              <div className="department">
                <div className="department-title">1. Детское отделение</div>
                <ul className="circles-list">
                  <li>КЕРАМИКА</li>
                  <li>ТКАЧЕСТВО</li>
                </ul>
              </div>

              <div className="department">
                <div className="department-title">2. Взрослое отделение</div>
                <ul className="circles-list">
                  <li>ТКАЧЕСТВО</li>
                  <li>ИЗО</li>
                  <li>КРУЖЕВО</li>
                  <li>КЕРАМИКА</li>
                </ul>
              </div>

              <div className="department">
                <div className="department-title">3. Общее отделение</div>
                <ul className="circles-list">
                  <li>КЕРАМИКА</li>
                  <li>ИЗО</li>
                  <li>ВЫШИВКА</li>
                  <li>ВЯЗАНИЕ</li>
                </ul>
              </div>
            </div>
            <div className="image-content">
              <img src="image/Group 9.png" alt="image2" className="image2" />
            </div>
          </div>
        </section>

        <section className="section section-about" id="about">
          <div className="about-panel">
            <img
              className="about-panel-bg"
              src="image/Group 12.png"
              alt=""
              decoding="async"
            />
            <div className="about-panel-inner">
              <p className="about-lead">
                Креативный центр «Земля искусства» — точка притяжения для
                талантливых людей.
              </p>
              <div className="about-body">
                <h2 className="about-heading">О нас</h2>
                <ul className="about-list">
                  <li>Школа художественных ремёсел «Земля искусства»;</li>
                  <li>Гончарная мастерская «SW ceramica»;</li>
                  <li>
                    <span className="about-text-desktop">
                      Автономная некоммерческая организация Тюменской области
                      «Дом народных художественных промыслов и ремёсел»;
                    </span>
                    <span className="about-text-mobile">
                      АНО ТО «Дом народных промыслов и ремёсел»;
                    </span>
                  </li>
                  <li>
                    <span className="about-text-desktop">
                      Этнографическая ремесленная мастерская «Тюменский махровый
                      ковёр»;
                    </span>
                    <span className="about-text-mobile">
                      Мастерская «Тюменский махровый ковёр»;
                    </span>
                  </li>
                  <li>
                    <span className="about-text-desktop">
                      Выставочное арт-пространство «Земля искусства».
                    </span>
                    <span className="about-text-mobile">
                      Арт-пространство «Земля искусства».
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="teachers">
          <div className="team-container">
            <div className="team-member">
              <img src="image/СветланаИ.png" alt="Светлана Ильюшонок" />
              <h3>Светлана Ильюшонок</h3>
              <p>
                Художник-керамист, член союза художников ДПИ, руководитель
                студии SW Ceramica, преподаватель.
              </p>
            </div>

            <div className="team-member">
              <img src="image/СветланаЮ.png" alt="Светлана Юрьевна" />
              <h3>Светлана Юрьевна</h3>
              <p>
                Тобольский государственный педагогический институт им. Д.И.
                Менделеева педагогический стаж — 20 лет.
              </p>
            </div>

            <div className="team-member">
              <img src="image/ЛеонидС.png" alt="Леонид Сергеевич" />
              <h3>Леонид Сергеевич</h3>
              <p>
                Диплом ТюмГУ 2012 г. — Государственное и муниципальное
                управление. Курсы Where Art Meets Architecture Курсы по работе с
                моделью
              </p>
            </div>

            <div className="team-member">
              <img src="image/НатальяД.png" alt="Наталья Денисова" />
              <h3>Наталья Денисова</h3>
              <p>
                Ткалья и мастер по прядению. Руководитель АНО ТО "Дом ремёсел" и
                ООО "Тюменский Махровый Ковёр".
              </p>
            </div>
          </div>

          <div className="button-container">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                setBooking({ type: "course", title: "Подбор курса" })
              }
            >
              Выбрать курс
            </button>
          </div>
        </section>

        <section className="section" id="competition">
          <div className="Competitions-list">
            <h2>Конкурсы</h2>
          </div>

          <div className="button-container">
            <a href="#contacts" className="btn btn-primary">
              Оставить заявку на конкурс
            </a>
          </div>
        </section>

        <section className="DocumentsSection" id="documents">
          <div className="documents-container">
            <div className="grid-7">
              {documents.map((doc, index) => (
                <div key={index} className="document-item">
                  {/\.(png|jpg|jpeg|webp|svg)$/i.test(doc.text) ? (
                    <img
                      src={doc.text.replace("/public", "")}
                      alt={doc.title || `Документ ${index + 1}`}
                    />
                  ) : (
                    <p>{doc.text}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="DirectionsSection" id="directions">
          <div className="section-head">
            <h3>Направления</h3>
            <p className="section-head-lead">
              Курсы рассчитаны на детей и родителей, которые хотят освоить
              простые приёмы.
            </p>
          </div>
          <div className="directions-container">
            {directions.map((item) => (
              <div className="direction-card" key={item.title}>
                <div className="direction-card-image">
                  {/\.(png|jpg|jpeg|webp|svg)$/i.test(item.image) ? (
                    <img
                      src={item.image.replace("/public", "")}
                      alt={item.title}
                    />
                  ) : (
                    <p>{item.image}</p>
                  )}
                </div>
                <div className="direction-card-content">
                  <h3 className="direction-card-title">{item.title}</h3>
                  <ul className="direction-card-description">
                    {item.descriptions?.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                  <div className="direction-card-footer">
                    <span className="direction-card-price">{item.price}</span>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() =>
                        setBooking({
                          type: "direction",
                          title: item.title,
                        })
                      }
                    >
                      Выбрать направление
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="WorksopsSection" id="workshops">
          <div className="section-head">
            <h3>Мастер-классы</h3>
          </div>
          <div className="directions-container">
            {workshops.map((item) => (
              <div className="direction-card" key={item.title}>
                <div className="direction-card-image">
                  {/\.(png|jpg|jpeg|webp|svg)$/i.test(item.image) ? (
                    <img
                      src={item.image.replace("/public", "")}
                      alt={item.title}
                    />
                  ) : (
                    <p>{item.image}</p>
                  )}
                </div>
                <div className="direction-card-content">
                  <h3 className="workshop-card-title">{item.title}</h3>
                  <ul className="direction-card-description">
                    {item.descriptions?.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                  <div className="direction-card-footer">
                    <span className="direction-card-price">{item.price}</span>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() =>
                        setBooking({
                          type: "workshop",
                          title: item.title,
                        })
                      }
                    >
                      Заказать
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="CoursesSection" id="courses">
          <div className="section-head">
            <h3>Курсы</h3>
          </div>
          <div className="directions-container">
            {courses.map((item) => (
              <div className="direction-card" key={item.title}>
                <div className="direction-card-image">
                  {/\.(png|jpg|jpeg|webp|svg)$/i.test(item.image) ? (
                    <img
                      src={item.image.replace("/public", "")}
                      alt={item.title}
                    />
                  ) : (
                    <p>{item.image}</p>
                  )}
                </div>
                <div className="direction-card-content">
                  <h3 className="courses-card-title">{item.title}</h3>
                  <ul className="direction-card-description">
                    {item.descriptions?.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                  <div className="direction-card-footer">
                    <span className="direction-card-price">{item.price}</span>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() =>
                        setBooking({
                          type: "course",
                          title: item.title,
                        })
                      }
                    >
                      Выбрать курс
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <ReviewsSection />
        <StudentsWorksSection />
        <FaqSection />
      </main>
      <section className="section section--contacts" id="contacts">
        <MapSection />
      </section>
      <Footer />
      <BookingModal
        isOpen={booking !== null}
        onClose={() => setBooking(null)}
        offerType={booking?.type ?? null}
        offerTitle={booking?.title ?? ""}
      />
    </div>
  );
}
