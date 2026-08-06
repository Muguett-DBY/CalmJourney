const navigationItems = ['Home', 'Live Map', 'Refuges', 'Forecast', 'Alerts']

const featureCards = [
  {
    label: 'Alerts',
    title: 'Real-time sensory alerts',
    description: 'Know when crowd, noise or activity levels become stressful.',
  },
  {
    label: 'Refuges',
    title: 'Nearby sensory refuges',
    description: 'Find parks, libraries and quiet public spaces on demand.',
  },
  {
    label: 'Forecast',
    title: 'One-hour sensory forecast',
    description: 'See which areas may become overwhelming before you arrive.',
  },
]

function SensoryMap() {
  return (
    <svg
      className="sensory-map"
      viewBox="0 0 570 264"
      role="img"
      aria-label="Illustrated map of sensory conditions in Melbourne CBD"
    >
      <rect width="570" height="264" rx="17" fill="#f0ede5" />

      <rect x="386" y="24" width="148" height="64" rx="12" fill="#d9e9dc" />
      <rect x="213" y="157" width="162" height="83" rx="12" fill="#d9e9dc" />

      <path
        d="M-1 181C56 140 119 158 170 176C239 200 280 206 347 180C409 156 462 201 543 163C560 155 571 162 574 175"
        fill="none"
        stroke="#d1e7ec"
        strokeLinecap="round"
        strokeWidth="34"
      />

      <g fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="8">
        <path d="M20 42H550" />
        <path d="M20 79H550" />
        <path d="M20 116H550" />
        <path d="M20 153H550" />
        <path d="M20 190H550" />
        <path d="M20 227H550" />
        <path d="M68 24V240" />
        <path d="M136 24V240" />
        <path d="M204 24V240" />
        <path d="M272 24V240" />
        <path d="M340 24V240" />
        <path d="M408 24V240" />
        <path d="M476 24V240" />
      </g>

      <g className="map-labels" fill="#7a8882">
        <text x="79" y="106" fontSize="18" fontWeight="700">MELBOURNE</text>
        <text x="79" y="128" fontSize="18" fontWeight="700">CBD</text>
        <text x="147" y="173">Bourke St</text>
        <text x="273" y="233">Yarra River</text>
        <text x="274" y="112">Swanston St</text>
        <text x="330" y="216">Exhibition St</text>
        <text x="410" y="209">Royal Botanic Gardens</text>
        <text x="398" y="74">Carlton Gardens</text>
      </g>

      <g>
        <rect x="137" y="109" width="142" height="32" rx="16" fill="#f7d9d5" />
        <text x="208" y="130" fill="#d75b54" fontSize="11" fontWeight="700" textAnchor="middle">
          HIGH STIMULATION
        </text>
        <circle cx="164" cy="89" r="14" fill="#d95d57" stroke="#fff" strokeWidth="3" />
      </g>

      <g>
        <rect x="372" y="73" width="119" height="32" rx="16" fill="#d8ebe3" />
        <text x="431.5" y="94" fill="#4c927d" fontSize="11" fontWeight="700" textAnchor="middle">
          QUIET REFUGE
        </text>
        <circle cx="442" cy="55" r="14" fill="#4c927d" stroke="#fff" strokeWidth="3" />
      </g>

      <circle cx="304" cy="165" r="12" fill="#6a92a8" stroke="#fff" strokeWidth="3" />
    </svg>
  )
}

export default function HomePage() {
  return (
    <div className="page-shell">
      <header className="site-header">
        <div className="header-brand">
          <span className="header-brand__name">CalmJourney</span>
          <span className="header-brand__tagline">Sensory-friendly urban travel companion</span>
        </div>

        <nav className="site-nav" aria-label="Primary navigation">
          {navigationItems.map((item, index) => (
            <span className={`site-nav__item${index === 0 ? ' site-nav__item--active' : ''}`} key={item}>
              {item}
            </span>
          ))}
        </nav>

        <div className="profile" aria-label="Signed in as Freddy">
          <span className="profile__avatar" aria-hidden="true">F</span>
          <span className="profile__name">Freddy</span>
        </div>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-copy">
            <p className="hero-copy__brand">CalmJourney</p>
            <p className="hero-copy__tagline">Sensory-friendly urban travel companion</p>
            <h1 id="hero-heading">Move through Melbourne with more certainty</h1>
            <p className="hero-copy__description">
              See sensory stressors, find quiet spaces, and receive predictive alerts
              before environments become overwhelming.
            </p>
            <div className="hero-actions" aria-label="Homepage actions">
              <span className="button button--primary">Open live map</span>
              <span className="button button--secondary">Find a quiet space</span>
            </div>
          </div>

          <section className="overview-card" aria-labelledby="overview-title">
            <div className="overview-card__header">
              <h2 id="overview-title">Live sensory overview</h2>
              <span className="live-pill">Live</span>
            </div>
            <SensoryMap />
          </section>
        </section>

        <section className="feature-grid" aria-label="CalmJourney features">
          {featureCards.map((card) => (
            <article className="feature-card" key={card.label}>
              <span className="feature-card__label">{card.label}</span>
              <h2>{card.title}</h2>
              <p>{card.description}</p>
              <span className="feature-card__link">Explore <span aria-hidden="true">→</span></span>
            </article>
          ))}
        </section>
      </main>

      <footer className="site-footer">
        Designed for sensory-sensitive and neurodivergent commuters travelling through Melbourne CBD.
      </footer>
    </div>
  )
}
