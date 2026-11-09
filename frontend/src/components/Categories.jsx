import { useState } from 'react';
import { HardHat, Shirt, Luggage, Wrench, ArrowUpRight } from 'lucide-react';
import { buildWhatsAppLink } from '../defaults.js';

const ICONS = [HardHat, Shirt, Luggage, Wrench];

function CardImage({ url, Icon, title }) {
  const [failed, setFailed] = useState(false);
  if (url && !failed) {
    return (
      <img
        src={url}
        alt={title}
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
    );
  }
  return (
    <div className="carbon flex h-full w-full items-center justify-center transition-transform duration-500 group-hover:scale-110">
      <Icon size={56} strokeWidth={1.25} className="text-ash transition-colors duration-300 group-hover:text-accent" aria-hidden="true" />
    </div>
  );
}

export default function Categories({ categories, whatsappNumber }) {
  return (
    <section id="shop" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
      <div className="max-w-2xl">
        <h2 className="font-heading text-3xl font-black uppercase tracking-tight sm:text-5xl">Gear up by category</h2>
        <p className="mt-4 text-ash">
          Every piece is checked by our riders before it reaches the shelf. Tap a category to ask about stock on WhatsApp.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {categories.map((c, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <a
              key={c.id}
              href={buildWhatsAppLink(whatsappNumber, `Hi Pit500, I am looking for ${c.title}. What do you have in stock?`)}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col overflow-hidden border border-white/10 bg-charcoal transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-accent"
            >
              <div className="aspect-[4/3] overflow-hidden border-b border-white/10">
                <CardImage url={c.imagePlaceholderUrl} Icon={Icon} title={c.title} />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-heading text-xl font-extrabold uppercase leading-tight transition-colors duration-300 group-hover:text-accent">
                  {c.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ash">{c.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-white transition-colors duration-300 group-hover:text-accent">
                  Ask about stock
                  <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </div>
              <span className="absolute bottom-0 left-0 h-1 w-0 bg-accent transition-all duration-500 group-hover:w-full" aria-hidden="true" />
            </a>
          );
        })}
      </div>
    </section>
  );
}
