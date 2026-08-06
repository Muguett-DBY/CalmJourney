import { useNavigate } from 'react-router-dom'
import InnerHeader from '../components/InnerHeader.jsx'

const features = [
  ['Quiet indoor areas', 'Low background noise and soft lighting'],
  ['Comfortable seating', 'Multiple seated rest areas'],
  ['Accessible facilities', 'Step-free entry and accessible bathrooms'],
  ['Long opening hours', 'Open today until 9 PM'],
]

export default function RefugeDetailPage() {
  const navigate = useNavigate()

  return (
    <div className="page-shell">
      <InnerHeader active="Refuges" />
      <main className="inner-main refuge-detail-main">
        <section className="page-title-row">
          <div><h1>State Library Victoria</h1><p>A calm indoor refuge in Melbourne CBD.</p></div>
          <button className="button button--primary compact-button" type="button" onClick={() => navigate('/refuges')}>Back to map</button>
        </section>

        <section className="refuge-hero-card">
          <div><span className="card-eyebrow">Recommended refuge</span><h2>State Library Victoria</h2><p>Library · 4 minute walk</p></div>
          <div className="refuge-score"><span className="status-pill">Very quiet</span><strong>Open now</strong><small>Until 9 PM</small></div>
        </section>

        <div className="refuge-detail-grid">
          <article className="dashboard-card refuge-features">
            <div className="section-heading"><div><h2>Why this space may help</h2><span>Sensory comfort features</span></div></div>
            <div className="feature-list">
              {features.map(([title, detail]) => <div key={title}><span aria-hidden="true">✓</span><p><strong>{title}</strong><small>{detail}</small></p></div>)}
            </div>
          </article>

          <div className="refuge-detail-stack">
            <article className="dashboard-card sensory-chart-card">
              <div className="section-heading"><div><h2>Expected sensory level</h2><span>Based on typical visitor patterns</span></div><span className="status-pill">Low now</span></div>
              <div className="sensory-chart" aria-label="Expected sensory level from now until 8 PM">
                {[30, 42, 58, 72, 64, 48, 38].map((height, index) => <span style={{ height: `${height}%` }} key={index} />)}
              </div>
              <div className="chart-labels"><span>Now</span><span>4 PM</span><span>5 PM</span><span>6 PM</span><span>7 PM</span><span>8 PM</span></div>
            </article>
            <article className="dashboard-card visit-notes">
              <h2>Average visit notes</h2>
              <p>Visitors often describe the La Trobe Reading Room as the calmest area during busy periods.</p>
              <div><span className="status-pill">Indoor seating</span><span className="status-pill">Low noise</span><span className="status-pill">Accessible</span></div>
              <button className="button button--primary" type="button" onClick={() => navigate('/forecast')}>Start navigation</button>
            </article>
          </div>
        </div>
      </main>
    </div>
  )
}
