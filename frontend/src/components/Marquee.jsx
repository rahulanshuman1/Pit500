// Slow ticker between the hero and the shop grid. Pauses on hover.
export default function Marquee({ categories }) {
  const items = [...categories.map((c) => c.title), 'Rider-tested gear', 'Fitted in store', 'Pan-India delivery'];
  const track = (hiddenFromReaders) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hiddenFromReaders || undefined}>
      {items.map((text, i) => (
        <li key={`${text}-${i}`} className="flex items-center">
          <span className="px-8 font-heading text-lg font-extrabold uppercase tracking-wide text-white/80 sm:text-2xl">
            {text}
          </span>
          <span className="h-2.5 w-2.5 rotate-45 bg-accent" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="group overflow-hidden border-b border-white/10 bg-charcoal py-5">
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {track(false)}
        {track(true)}
      </div>
    </div>
  );
}
