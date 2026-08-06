import { useNavigate } from 'react-router-dom'
import InnerHeader from '../components/InnerHeader.jsx'

const journeySteps = [
  ['1', 'Sensory conditions change', 'Swanston Street changes from Moderate to High, expected around 5:10 PM.'],
  ['2', 'Your original route enters the busiest corridor', 'This creates approximately 12 minutes of high-density exposure.'],
  ['3', 'A lower-stress route is available', 'The recommended alternative adds about 4 minutes.'],
]

const actions = [
  ['Reroute now', 'Low sensory load · +4 min', 'Avoid Swanston Street', 'recommended'],
  ['Pause at State Library', 'Quiet refuge · 4 min walk', 'Continue after peak period', 'refuge'],
  ['Keep current route', 'High sensory load', 'Not recommended', 'risk'],
]

export default function AlertPage() {
  const navigate = useNavigate()

  return (
    <div className="page-shell">
      <InnerHeader active="Alerts" />
      <main className="inner-main alert-main">
        <section className="page-title-row">
          <div><h1>Predictive sensory alert</h1><p>Swanston Street is likely to become overwhelming before you arrive.</p></div>
          <button className="button button--primary compact-button" type="button" onClick={() => navigate('/dashboard')}>Dismiss alert</button>
        </section>

        <section className="alert-banner">
          <div><span className="status-pill status-pill--danger">High priority</span><h2>High pedestrian density predicted in 35 minutes</h2><p>This affects your saved route to State Library Victoria between 5:10 and 5:45 PM.</p></div>
          <div className="alert-confidence"><span>Confidence</span><strong>86%</strong><small>Updated 1 min ago</small></div>
        </section>

        <section className="dashboard-card journey-impact">
          <div className="section-heading"><div><h2>What this means for your journey</h2><span>A clear view of the predicted impact</span></div></div>
          <div className="journey-step-list">
            {journeySteps.map(([number, title, detail]) => <div key={number}><span>{number}</span><p><strong>{title}</strong><small>{detail}</small></p></div>)}
          </div>
          <div className="wellbeing-note"><strong>Wellbeing note</strong><span>Consider visiting a nearby quiet space before continuing your journey.</span></div>
        </section>

        <section className="dashboard-card recommended-actions">
          <div className="section-heading"><div><h2>Recommended actions</h2><span>Choose the option that best supports your comfort</span></div></div>
          <div className="action-list">
            {actions.map(([title, detail, badge, tone]) => (
              <button type="button" onClick={() => navigate(tone === 'refuge' ? '/refuges/state-library-victoria' : tone === 'recommended' ? '/forecast' : '/dashboard')} key={title}>
                <span><strong>{title}</strong><small>{detail}</small></span>
                <span className={`status-pill${tone === 'risk' ? ' status-pill--danger' : ''}`}>{badge}</span>
              </button>
            ))}
          </div>
          <div className="alert-footer"><p><strong>Why did I receive this alert?</strong><span>Historical pedestrian counts show a repeated peak at this time.</span></p><button className="button button--primary" type="button" onClick={() => navigate('/forecast')}>Choose recommended reroute</button></div>
        </section>
      </main>
    </div>
  )
}
