import { useState } from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';
import { buildWhatsAppLink } from '../defaults.js';

const LINKS = [
  { label: 'Shop', href: '#shop' },
  { label: 'About', href: '#about' },
  { label: 'Visit Us', href: '#visit' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar({ whatsappNumber }) {
  const [open, setOpen] = useState(false);
  const wa = buildWhatsAppLink(whatsappNumber);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-asphalt/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8" aria-label="Main">
        <a href="#top" className="font-heading text-2xl font-black uppercase tracking-tight text-white">
          PIT<span className="text-accent">500</span>
        </a>

        <ul className="hidden items-center gap-9 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="relative py-1 text-sm font-semibold uppercase tracking-wide text-ash transition-colors duration-300 hover:text-white after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 border-2 border-accent bg-accent px-4 py-2 text-sm font-bold uppercase tracking-wide text-black transition-all duration-300 hover:bg-transparent hover:text-accent sm:inline-flex"
          >
            <MessageCircle size={16} aria-hidden="true" />
            WhatsApp Us
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="inline-flex h-10 w-10 items-center justify-center border border-white/20 text-white transition-colors duration-300 hover:border-accent hover:text-accent md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`grid overflow-hidden border-white/10 bg-charcoal transition-all duration-300 md:hidden ${
          open ? 'grid-rows-[1fr] border-t' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="min-h-0">
          <ul className="flex flex-col px-5 py-3">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-white/5 py-4 text-base font-semibold uppercase tracking-wide text-white transition-colors duration-300 hover:text-accent"
                  tabIndex={open ? 0 : -1}
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="py-4">
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={open ? 0 : -1}
                className="flex items-center justify-center gap-2 bg-accent px-4 py-3 text-sm font-bold uppercase tracking-wide text-black"
              >
                <MessageCircle size={16} aria-hidden="true" />
                WhatsApp Us
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
