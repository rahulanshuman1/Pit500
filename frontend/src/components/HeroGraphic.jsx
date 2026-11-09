// Asphalt road in perspective. Swap this component for <img src="/hero-bike.png" /> when you have a photo.
export default function HeroGraphic() {
  return (
    <div className="carbon relative aspect-[5/4] w-full overflow-hidden border border-white/10">
      <svg viewBox="0 0 600 480" className="absolute inset-0 h-full w-full" role="img" aria-label="Open road at speed">
        <defs>
          <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1E1E1E" />
            <stop offset="1" stopColor="#0b0b0b" />
          </linearGradient>
          <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgb(255 87 34)" stopOpacity="0.55" />
            <stop offset="1" stopColor="rgb(255 87 34)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="600" height="480" fill="#121212" />
        <rect y="150" width="600" height="3" fill="url(#glow)" opacity="0.9" />
        <rect y="153" width="600" height="60" fill="url(#glow)" opacity="0.18" />
        <polygon points="285,153 315,153 640,480 -40,480" fill="url(#road)" />
        <polygon points="285,153 289,153 -40,480 -120,480" fill="#FF5722" opacity="0.9" />
        <polygon points="311,153 315,153 720,480 640,480" fill="#FF5722" opacity="0.9" />
        <g fill="#9CA3AF">
          <polygon points="298.5,158 301.5,158 303,176 297,176" />
          <polygon points="297,190 303,190 306,222 294,222" />
          <polygon points="294.5,246 305.5,246 311,306 289,306" />
          <polygon points="289,340 311,340 322,436 278,436" />
        </g>
      </svg>
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px overflow-hidden">
        <div className="h-px w-1/3 animate-streak bg-gradient-to-r from-transparent via-accent to-transparent" />
      </div>
      <div className="absolute bottom-3 left-3 border border-white/15 bg-asphalt/80 px-3 py-1.5 text-xs text-ash">
        Hero image slot: drop in a bike or rider photo
      </div>
    </div>
  );
}
