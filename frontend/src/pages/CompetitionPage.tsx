import { competition } from '../content/siteData'
import { NavLink } from 'react-router-dom'

export default function CompetitionPage() {
  return (
    <section className="section">
      <h2 className="section-title">{competition.title}</h2>
      <div className="card">
        <p className="mb-14">{competition.lead}</p>
        <div className="cta-row">
          <NavLink className="btn btn-primary" to="/apply/competition">
            Подать заявку на конкурс
          </NavLink>
        </div>
      </div>
    </section>
  )
}

