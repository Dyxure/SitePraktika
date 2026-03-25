import { contact } from '../content/siteData'

export default function MapSection() {
  return (
    <section className="map-section">
      <div className="map-split">
        <div className="map-left">
          <div className="text-map">
            <img src="/image/лого 2.svg" alt="Logo" />

            <div className="map-contacts">
              <div className="map-contact">{contact.phone?.[1] ?? contact.phone?.[0]}</div>
              <div className="map-contact">{contact.phone?.[0]}</div>
              <div className="map-contact">domremesel72@mail.ru</div>
            </div>

            <div className="map-dots" aria-hidden="true">
              <span className="map-dot map-dot-yellow" />
              <span className="map-dot map-dot-green" />
              <span className="map-dot map-dot-pink" />
            </div>

            <div className="map-note">Ждём вас и ваших детей на <br />наших занятиях!</div>
          </div>
        </div>
        <div className="map-right">
          <div className="map-divider" aria-hidden="true" />
          <iframe
            className="map-iframe"
            src="https://yandex.ru/map-widget/v1/?um=constructor%3Acabfc8c3bf6533db3ceb3ddf1e13507a8f7d91ae00fafa11a397180647893508&amp;source=constructor"
            width="100%"
            height="500"
            frameBorder="0"
          />
        </div>
      </div>
    </section>
  )
}