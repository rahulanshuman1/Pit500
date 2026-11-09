import { useEffect, useState } from 'react';
import { Menu, X, MessageCircle, LogIn } from 'lucide-react';
import Logo from './Logo.jsx';
import { buildWhatsAppLink } from '../defaults.js';

const LINKS = [
  { label: 'Shop', href: '#shop' },
  { label: 'About', href: '#about' },
  { label: 'Visit Us', href: '#visit' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar({ whatsappNumber }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const wa = buildWhatsAppLink(whatsappNumber);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(window.scrollY > 24);
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled ? 'border-white/10 bg-asphalt/95 shadow-lg shadow-black/40 backdrop-blur' : 'border-transparent bg-asphalt/70 backdrop-blur'
      }`}
    >
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-300 sm:px-8 ${
          scrolled ? 'h-14' : 'h-[4.5rem]'
        }`}
        aria-label="Main"
      >
        <a href="#top" aria-label="Pit500 home" className="flex items-center">
          <Logo />
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
            href="/admin"
            className="hidden items-center gap-2 border border-white/25 px-4 py-2 text-sm font-bold uppercase tracking-wide text-white transition-all duration-300 hover:border-accent hover:text-accent sm:inline-flex"
          >
            <LogIn size={16} aria-hidden="true" />
            Sign in
          </a>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 border-2 border-accent bg-accent px-4 py-2 text-sm font-bold uppercase tracking-wide text-black transition-all duration-300 hover:bg-transparent hover:text-accent lg:inline-flex"
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
            {LINKS.map((l, i) => (
              <li
                key={l.href}
                className={`transition-all duration-300 ${open ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
                style={{ transitionDelay: open ? `${i * 60}ms` : '0ms' }}
              >
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
            <li className="grid gap-3 py-4">
              <a
                href="/admin"
                tabIndex={open ? 0 : -1}
                className="flex items-center justify-center gap-2 border border-white/25 px-4 py-3 text-sm font-bold uppercase tracking-wide text-white"
              >
                <LogIn size={16} aria-hidden="true" />
                Admin sign in
              </a>
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

      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-transparent" aria-hidden="true">
        <div className="h-full bg-accent transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>
    </header>
  );
}
