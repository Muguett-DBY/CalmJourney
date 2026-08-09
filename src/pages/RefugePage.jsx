import { useNavigate } from 'react-router-dom'
import InnerHeader from '../components/InnerHeader.jsx'

const filters = ['All', 'Parks', 'Libraries', 'Quiet public spaces']

const quietSpaces = [
  {
    name: 'State Library Victoria',
    meta: 'Library · 4 min',
    level: 'Very quiet',
    detail: 'Open until 9 PM',
  },
  {
    name: 'Carlton Gardens',
    meta: 'Park · 7 min',
    level: 'Low stimulation',
    detail: 'Shaded seating',
  },
  {
    name: 'City Square Quiet Space',
    meta: 'Public space · 8 min',
    level: 'Moderate',
    detail: 'Covered seating',
  },
  {
    name: 'Treasury Gardens',
    meta: 'Park · 9 min',
    level: 'Low stimulation',
    detail: 'Open space',
  },
]

function RefugeMapIllustration() {
  return (
    <svg
      className="refuge-map"
      viewBox="0 0 1008 565"
      role="img"
      aria-label="Illustrated map showing recommended routes to quiet spaces in Melbourne CBD"
    >
      <rect width="1008" height="565" rx="18" fill="#f0ede5" />

      <rect x="685" y="24" width="263" height="136" rx="12" fill="#d9e9dc" />
      <rect x="382" y="388" width="282" height="126" rx="12" fill="#d9e9dc" />
      <rect x="484" y="114" width="90" height="181" rx="12" fill="#f3d9d4" />

      <path
        d="M0 481C100 443 176 459 267 474C363 491 462 512 562 486C683 455 802 520 1010 462"
        fill="none"
        stroke="#d1e7ec"
        strokeLinecap="round"
        strokeWidth="35"
      />

      <g fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="8">
        <path d="M20 90H988" />
        <path d="M20 170H988" />
        <path d="M20 250H988" />
        <path d="M20 330H988" />
        <path d="M20 410H988" />
        <path d="M20 490H988" />
        <path d="M120 24V520" />
        <path d="M240 24V520" />
        <path d="M360 24V520" />
        <path d="M480 24V520" />
        <path d="M600 24V520" />
        <path d="M720 24V520" />
        <path d="M840 24V520" />
      </g>

      <g fill="#7a8882" fontSize="12" fontWeight="700">
        <text x="78" y="105" fontSize="19">MELBOURNE</text>
        <text x="78" y="127" fontSize="19">CBD</text>
        <text x="261" y="172">Bourke St</text>
        <text x="282" y="288">Collins St</text>
        <text x="293" y="412">Flinders St</text>
        <text x="584" y="213">Exhibition St</text>
        <text x="765" y="280">Spring St</text>
        <text x="687" y="71">Carlton Gardens</text>
        <text x="725" y="444">Royal Botanic Gardens</text>
        <text x="402" y="534">Yarra River</text>
      </g>

      <g fill="none" stroke="#4c927d" strokeDasharray="10 8" strokeLinecap="round" strokeWidth="4">
        <path d="M518 426L397 174" />
        <path d="M518 426L718 84" />
        <path d="M518 426L840 252" />
        <path d="M518 426L376 372" />
      </g>

      <g>
        <rect x="459" y="80" width="139" height="31" rx="16" fill="#f7d9d5" />
        <text x="528.5" y="100" fill="#d75b54" fontSize="11" fontWeight="700" textAnchor="middle">
          HIGH STIMULATION
        </text>
      </g>

      {[
        { x: 397, y: 174, label: 'L' },
        { x: 718, y: 84, label: 'P' },
        { x: 840, y: 252, label: 'P' },
        { x: 376, y: 372, label: 'Q' },
      ].map((point) => (
        <g key={`${point.label}-${point.x}`}>
          <circle cx={point.x} cy={point.y} r="18" fill="#4c927d" stroke="#fff" strokeWidth="3" />
          <text x={point.x} y={point.y + 5} fill="#fff" fontSize="12" fontWeight="700" textAnchor="middle">
            {point.label}
          </text>
        </g>
      ))}

      <g>
        <circle cx="518" cy="426" r="15" fill="#6a92a8" stroke="#fff" strokeWidth="4" />
        <rect x="454" y="445" width="126" height="31" rx="16" fill="#dce9ef" />
        <text x="517" y="465" fill="#5f879c" fontSize="11" fontWeight="700" textAnchor="middle">
          YOU ARE HERE
        </text>
      </g>

      <g>
        <rect x="18" y="521" width="972" height="35" rx="11" fill="#fffdf8" fillOpacity="0.94" />
        <path d="M38 539H86" stroke="#4c927d" strokeLinecap="round" strokeWidth="4" />
        <text x="98" y="544" fill="#7a8882" fontSize="12" fontWeight="700">Recommended route</text>
        <circle cx="252" cy="539" r="8" fill="#4c927d" />
        <text x="269" y="544" fill="#7a8882" fontSize="12" fontWeight="700">Park / library / quiet space</text>
        <rect x="484" y="530" width="18" height="18" rx="5" fill="#f3d9d4" />
        <text x="516" y="544" fill="#7a8882" fontSize="12" fontWeight="700">High-stimulation zone</text>
      </g>
    </svg>
  )
}

export default function RefugePage() {
  const navigate = useNavigate()

  return (
    <div className="page-shell refuge-page">
      <InnerHeader active="Refuges" />

      <main className="refuge-main">
        <section className="refuge-intro" aria-labelledby="refuge-heading">
          <div>
            <h1 id="refuge-heading">Sensory refuge map</h1>
            <p>Find parks, libraries and calm public spaces near your current location.</p>
          </div>
          <button className="button button--primary location-button" type="button">Use my location</button>
        </section>

        <div className="refuge-layout">
          <div className="refuge-map-column">
            <section className="refuge-filters" aria-label="Refuge filters">
              <div className="refuge-filter-group">
                {filters.map((filter, index) => (
                  <button
                    className={`filter-pill${index === 0 ? ' filter-pill--active' : ''}`}
                    type="button"
                    key={filter}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <div className="walking-filter">
                <span>Walking distance</span>
                <button className="filter-pill walking-filter__value" type="button">10 min</button>
              </div>
            </section>

            <figure className="refuge-map-frame">
              <RefugeMapIllustration />
            </figure>
          </div>

          <aside className="quiet-spaces-panel" aria-labelledby="quiet-spaces-heading">
            <div className="quiet-spaces-panel__heading">
              <h2 id="quiet-spaces-heading">Nearby quiet spaces</h2>
              <p>Sorted by distance and sensory comfort</p>
            </div>

            <div className="quiet-spaces-list">
              {quietSpaces.map((space) => (
                <button
                  className="quiet-space-card"
                  type="button"
                  onClick={() => navigate('/refuges/state-library-victoria')}
                  key={space.name}
                >
                  <strong>{space.name}</strong>
                  <span className="quiet-space-card__meta">{space.meta}</span>
                  <span className="quiet-space-card__footer">
                    <span className="comfort-pill">{space.level}</span>
                    <span>{space.detail}</span>
                  </span>
                </button>
              ))}
            </div>

            <button
              className="button button--primary navigate-button"
              type="button"
              onClick={() => navigate('/refuges/state-library-victoria')}
            >
              Navigate to selected refuge
            </button>
          </aside>
        </div>
      </main>
    </div>
  )
}
