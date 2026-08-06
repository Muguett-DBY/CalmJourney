export default function ForecastMap() {
  return (
    <svg className="forecast-map" viewBox="0 0 840 500" role="img" aria-label="Forecast routes across Melbourne CBD">
      <rect width="840" height="500" rx="18" fill="#f0ede5" />
      <rect x="586" y="36" width="190" height="128" rx="14" fill="#d9e9dc" />
      <rect x="327" y="350" width="230" height="116" rx="14" fill="#d9e9dc" />
      <path d="M-10 426C120 382 218 417 324 436C470 462 575 402 850 430" fill="none" stroke="#d1e7ec" strokeLinecap="round" strokeWidth="36" />
      <g fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="8">
        {[82, 160, 238, 316, 394, 472].map((y) => <path d={`M20 ${y}H820`} key={y} />)}
        {[102, 202, 302, 402, 502, 602, 702].map((x) => <path d={`M${x} 24V476`} key={x} />)}
      </g>
      <g fill="#7a8882" fontSize="13" fontWeight="700">
        <text x="52" y="104" fontSize="20">MELBOURNE</text><text x="52" y="128" fontSize="20">CBD</text>
        <text x="232" y="158">Bourke St</text><text x="252" y="236">Collins St</text>
        <text x="265" y="314">Flinders St</text><text x="442" y="110">Swanston St</text>
        <text x="630" y="230">Spring St</text><text x="600" y="386">Royal Botanic Gardens</text>
      </g>
      <path d="M700 410L686 286L320 90" fill="none" stroke="#4c927d" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7" />
      <path d="M700 410L480 286L320 90" fill="none" stroke="#d95e55" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7" />
      <path d="M700 410L376 274L320 90" fill="none" stroke="#dca348" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7" />
      <circle cx="700" cy="410" r="15" fill="#6a92a8" stroke="#fff" strokeWidth="4" />
      <circle cx="320" cy="90" r="14" fill="#4c927d" stroke="#fff" strokeWidth="4" />
      <g fontSize="11" fontWeight="700" textAnchor="middle">
        <rect x="268" y="56" width="104" height="28" rx="14" fill="#dcebe5" /><text x="320" y="74" fill="#4c927d">STATE LIBRARY</text>
        <rect x="462" y="244" width="113" height="28" rx="14" fill="#f7d9d5" /><text x="518" y="262" fill="#d95e55">HIGH IN 35 MIN</text>
        <rect x="541" y="174" width="137" height="28" rx="14" fill="#dcebe5" /><text x="609" y="192" fill="#4c927d">RECOMMENDED LOW</text>
      </g>
    </svg>
  )
}
