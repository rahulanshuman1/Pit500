import { ArrowDown } from 'lucide-react';
import HeroGraphic from './HeroGraphic.jsx';

export default function Hero({ headline, subheadline }) {
  // "FUEL YOUR PASSION. PROTECT YOUR RIDE." renders one sentence per line, the last in the accent colour.
  const lines = (headline || '')
    .split(/(?<=[.!?])\s+/)
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <section id="top" className="relative overflow-hidden border-b border-white/10">
      <div
        className="pointer-events-none absolute -left-40 top-0 h-[34rem] w-[34rem] rounded-full bg-accent/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <div>
          <h1 className="font-heading text-4xl font-black uppercase leading-[1.05] tracking-tight sm:text-6xl xl:text-7xl">
            {lines.map((line, i) => (
              <span key={i} className={`block ${i === lines.length - 1 && lines.length > 1 ? 'text-accent' : ''}`}>
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ash sm:text-lg">{subheadline}</p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#shop"
              className="group inline-flex animate-ring items-center gap-3 bg-accent px-8 py-4 font-heading text-sm font-extrabold uppercase tracking-wider text-black transition-all duration-300 hover:bg-white"
            >
              Explore Gear
              <ArrowDown size={18} className="transition-transform duration-300 group-hover:translate-y-1" aria-hidden="true" />
            </a>
            <a
              href="#visit"
              className="inline-flex items-center border-2 border-white/25 px-8 py-4 font-heading text-sm font-extrabold uppercase tracking-wider text-white transition-all duration-300 hover:border-accent hover:text-accent"
            >
              Visit the Store
            </a>
          </div>
        </div>
        <HeroGraphic />
      </div>
    </section>
  );
}
