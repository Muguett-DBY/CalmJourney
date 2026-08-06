import { useNavigate } from 'react-router-dom'
import InnerHeader from '../components/InnerHeader.jsx'

const conditions = [
  { icon: '●', title: 'Pedestrian density', value: 'Moderate', note: 'Manageable', tone: 'warning' },
  { icon: '▥', title: 'Noise level', value: 'Low', note: 'Comfortable', tone: 'safe' },
  { icon: '✦', title: 'Visual activity', value: 'Moderate', note: 'Manageable', tone: 'warning' },
  { icon: '⌁', title: 'Nearby construction', value: 'None', note: 'Stable', tone: 'safe' },
]

const refuges = [
  ['State Library Victoria', 'Library · 4 min', 'Very quiet'],
  ['Carlton Gardens', 'Park · 7 min', 'Low stimulation'],
  ['City Square Quiet Space', 'Public space · 8 min', 'Moderate'],
]

export default function DashboardPage() {
  const navigate = useNavigate()

  return (
    <div className="page-shell">
      <InnerHeader active="Home" />
      <main className="dashboard-main">
        <section className="page-title-row">
          <div><h1>Good afternoon, Emily</h1><p>Your current sensory environment around your saved journey.</p></div>
          <button className="button button--primary compact-button" type="button" onClick={() => navigate('/refuges')}>Find a place</button>
        </section>

        <section className="dashboard-top-grid">
          <article className="dashboard-card journey-card">
            <div className="card-eyebrow">Nearby quiet journey</div>
            <div className="journey-route">
              <span className="route-marker">R</span><span>Richmond Station</span><span className="route-line" />
              <span className="route-marker route-marker--destination">L</span><span>State Library Victoria</span>
            </div>
            <div className="journey-meta"><strong>Leave at 4:35 PM</strong><span className="status-pill status-pill--warning">Sensory load: Moderate</span></div>
            <p>A busy corridor is predicted near Swanston Street in 35 minutes.</p>
            <button className="text-action" type="button" onClick={() => navigate('/forecast')}>View safer routes <span>→</span></button>
          </article>

          <article className="dashboard-card alert-preview">
            <div><span className="card-eyebrow card-eyebrow--danger">Predictive alert</span><span className="status-pill status-pill--danger">High</span></div>
            <h2>Swanston Street</h2>
            <p>High pedestrian density likely by 5:10 PM.</p>
            <button className="text-action text-action--danger" type="button" onClick={() => navigate('/alerts')}>View alert <span>→</span></button>
          </article>
        </section>

        <section aria-labelledby="conditions-heading">
          <div className="section-heading"><h2 id="conditions-heading">Current sensory conditions</h2><span>Updated just now</span></div>
          <div className="condition-grid">
            {conditions.map((condition) => (
              <article className="condition-card" key={condition.title}>
                <span className={`condition-icon condition-icon--${condition.tone}`} aria-hidden="true">{condition.icon}</span>
                <div><span>{condition.title}</span><strong>{condition.value}</strong><small>{condition.note}</small></div>
              </article>
            ))}
          </div>
        </section>

        <section className="dashboard-bottom-grid">
          <article className="dashboard-card refuge-summary">
            <div className="section-heading"><div><h2>Nearby sensory refuges</h2><span>Closest calm spaces</span></div><button className="text-action" type="button" onClick={() => navigate('/refuges')}>View all refuges →</button></div>
            <div className="summary-list">
              {refuges.map(([name, meta, level]) => (
                <button type="button" onClick={() => navigate('/refuges/state-library-victoria')} key={name}>
                  <span className="summary-icon">⌂</span><span><strong>{name}</strong><small>{meta}</small></span><span className="status-pill">{level}</span>
                </button>
              ))}
            </div>
          </article>

          <article className="dashboard-card forecast-summary">
            <div className="section-heading"><div><h2>Next-hour forecast</h2><span>Saved route conditions</span></div></div>
            <div className="forecast-steps">
              {[['Now', 'Moderate'], ['+20 min', 'Moderate'], ['+40 min', 'High'], ['+60 min', 'High']].map(([time, level]) => (
                <div key={time}><span>{time}</span><strong className={level === 'High' ? 'danger-text' : ''}>{level}</strong></div>
              ))}
            </div>
            <p>Crowding is expected to peak around Swanston Street between 5:10 and 5:45 PM.</p>
            <button className="text-action" type="button" onClick={() => navigate('/forecast')}>Open forecast map <span>→</span></button>
          </article>
        </section>
      </main>
    </div>
  )
}
