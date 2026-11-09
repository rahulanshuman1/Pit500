// Animated Pit500 logo: a tachometer gauge whose ring draws in and needle sweeps to redline,
// then settles and idles. Hover the link around it to rev the needle again.
const TICKS = Array.from({ length: 9 }, (_, i) => -135 + i * 33.75);

export default function Logo({ size = 'md' }) {
  const big = size === 'lg';
  return (
    <span className="inline-flex items-center gap-2.5" role="img" aria-label="Pit500">
      <svg viewBox="0 0 48 48" className={`logo-hub shrink-0 ${big ? 'h-20 w-20' : 'h-10 w-10'}`} aria-hidden="true">
        <circle cx="24" cy="24" r="21" fill="#161616" stroke="#2a2a2a" strokeWidth="1.5" />
        <circle
          cx="24"
          cy="24"
          r="16"
          fill="none"
          stroke="rgb(var(--accent))"
          strokeWidth="3"
          strokeLinecap="round"
          pathLength="100"
          className="logo-ring"
          transform="rotate(135 24 24)"
        />
        {TICKS.map((angle, i) => (
          <line
            key={angle}
            x1="24"
            y1="4.5"
            x2="24"
            y2={i >= 7 ? '8.5' : '7.5'}
            stroke={i >= 7 ? 'rgb(var(--accent))' : '#9CA3AF'}
            strokeWidth={i >= 7 ? 2 : 1.4}
            strokeLinecap="round"
            transform={`rotate(${angle} 24 24)`}
            className="logo-tick"
            style={{ animationDelay: `${0.5 + i * 0.09}s` }}
          />
        ))}
        <g className="logo-needle">
          <path d="M24 10 L26 24 L22 24 Z" fill="#FFFFFF" />
        </g>
        <circle cx="24" cy="24" r="3.2" fill="rgb(var(--accent))" />
        <circle cx="24" cy="24" r="1.2" fill="#121212" />
      </svg>

      <span className="flex flex-col">
        <span
          className={`font-heading font-black uppercase leading-none tracking-tight text-white ${
            big ? 'text-5xl' : 'text-2xl'
          }`}
        >
          {'PIT'.split('').map((ch, i) => (
            <span key={`p${i}`} className="logo-letter" style={{ animationDelay: `${0.7 + i * 0.09}s` }}>
              {ch}
            </span>
          ))}
          <span className="logo-glow text-accent">
            {'500'.split('').map((ch, i) => (
              <span key={`n${i}`} className="logo-letter" style={{ animationDelay: `${1 + i * 0.09}s` }}>
                {ch}
              </span>
            ))}
          </span>
        </span>
        <span className="logo-shine mt-1.5 block h-0.5 w-full bg-white/10" aria-hidden="true" />
      </span>
    </span>
  );
}
