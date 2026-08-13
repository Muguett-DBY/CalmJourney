import { useNavigate } from 'react-router-dom'
import InnerHeader from '../components/InnerHeader.jsx'

const featureCards = [
  {
    icon: 'alerts',
    title: 'One-hour crowd alerts',
    description: 'Use current and historical pedestrian data to plan before busy periods.',
    path: '/alerts',
  },
  {
    icon: 'refuges',
    title: 'Nearby sensory refuges',
    description: 'Find parks, libraries and quiet public spaces on demand.',
    path: '/refuges',
  },
]

const iconPaths = {
  alerts: ['M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9', 'M10 21h4'],
  refuges: ['M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0', 'M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6'],
}

function FeatureIcon({ name }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {iconPaths[name].map((path) => <path d={path} key={path} />)}
    </svg>
  )
}

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="page-shell landing-page">
      <InnerHeader active="Home" />

      <main className="landing-main">
        <section className="landing-hero" aria-labelledby="landing-heading">
          <div className="landing-copy">
            <h1 id="landing-heading">Travel with less stress<br /> Arrive with more calm</h1>
            <p>
              See sensory stressors, find quiet spaces, and receive predictive alerts<br /> before environments become overwhelming.
            </p>
            <div className="landing-actions">
              <button className="button button--primary" type="button" onClick={() => navigate('/refuges')}>
                Find a quiet space nearby
              </button>
              <button className="button button--secondary" type="button" onClick={() => navigate('/alerts')}>
                Check crowd alerts
              </button>
            </div>
          </div>
        </section>

        <section className="landing-features" aria-label="CalmJourney features">
          {featureCards.map((card) => (
            <article className="landing-feature-card" key={card.title}>
              <span className="landing-feature-icon"><FeatureIcon name={card.icon} /></span>
              <h2>{card.title}</h2>
              <p>{card.description}</p>
              <button type="button" onClick={() => navigate(card.path)} aria-label={`Open ${card.title}`}>
                →
              </button>
            </article>
          ))}
        </section>
      </main>

      <footer className="landing-footer">
        Designed for sensory-sensitive and neurodivergent commuters travelling through Melbourne CBD.
      </footer>
    </div>
  )
}
