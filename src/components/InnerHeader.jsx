import { useNavigate } from 'react-router-dom'

const items = [
  { label: 'Home', path: '/' },
  { label: 'Live Map', path: '/dashboard' },
  { label: 'Refuges', path: '/refuges' },
  { label: 'Forecast', path: '/forecast' },
  { label: 'Alerts', path: '/alerts' },
]

export default function InnerHeader({ active }) {
  const navigate = useNavigate()

  return (
    <header className="site-header inner-header">
      <button className="header-brand header-brand--button" type="button" onClick={() => navigate('/')}>
        <span className="header-brand__name">CalmJourney</span>
        <span className="header-brand__tagline">Sensory-friendly urban travel companion</span>
      </button>

      <nav className="site-nav" aria-label="Primary navigation">
        {items.map((item) => (
          <button
            className={`site-nav__item${item.label === active ? ' site-nav__item--active' : ''}`}
            type="button"
            aria-current={item.label === active ? 'page' : undefined}
            onClick={() => navigate(item.path)}
            key={item.label}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <button className="profile" type="button" aria-label="Signed in as Freddy">
        <span className="profile__avatar" aria-hidden="true">F</span>
        <span className="profile__name">Freddy</span>
      </button>
    </header>
  )
}
