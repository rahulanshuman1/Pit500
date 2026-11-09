import { useState } from 'react';
import { Instagram, Youtube, Facebook, Loader2, Check, Phone } from 'lucide-react';
import { SOCIALS } from '../defaults.js';

const SOCIAL_ICONS = { Instagram, YouTube: Youtube, Facebook };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Footer({ address, whatsappNumber }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | done | error

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setStatus('error');
      return;
    }
    setStatus('sending');
    // The brief defines no newsletter endpoint, so this only confirms on screen.
    // Wire it to your mailing provider here (e.g. await api.post('/api/subscribe', { email })).
    await new Promise((r) => setTimeout(r, 600));
    setStatus('done');
    setEmail('');
  };

  const phone = String(whatsappNumber || '').replace(/\D/g, '');

  return (
    <footer id="contact" className="border-t border-white/10 bg-charcoal">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2">
        <div>
          <h2 className="font-heading text-3xl font-black uppercase tracking-tight sm:text-4xl">Join the Inner Circle</h2>
          <p className="mt-3 max-w-md text-ash">New arrivals, ride-day offers and gear guides. No spam, unsubscribe any time.</p>

          <form onSubmit={onSubmit} className="mt-6 flex max-w-md flex-col gap-3 sm:flex-row" noValidate>
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status !== 'sending') setStatus('idle');
              }}
              placeholder="you@email.com"
              autoComplete="email"
              aria-invalid={status === 'error'}
              className="min-w-0 flex-1 border border-white/20 bg-asphalt px-4 py-3 text-white placeholder-ash/60 transition-colors duration-300 focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="inline-flex items-center justify-center gap-2 bg-accent px-6 py-3 text-sm font-bold uppercase tracking-wide text-black transition-all duration-300 hover:bg-white disabled:opacity-60"
            >
              {status === 'sending' ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
              Subscribe
            </button>
          </form>
          <p className="mt-3 min-h-[1.5rem] text-sm" role="status">
            {status === 'error' && <span className="text-red-400">Enter a valid email address, like name@example.com.</span>}
            {status === 'done' && (
              <span className="inline-flex items-center gap-2 text-emerald-400">
                <Check size={16} aria-hidden="true" /> You are on the list.
              </span>
            )}
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="font-heading text-sm font-extrabold uppercase tracking-wide text-white">Find us</h3>
            <p className="mt-3 text-sm leading-relaxed text-ash">{address}</p>
            {phone && (
              <a
                href={`tel:+${phone}`}
                className="mt-3 inline-flex items-center gap-2 text-sm text-ash transition-colors duration-300 hover:text-accent"
              >
                <Phone size={14} aria-hidden="true" /> +{phone}
              </a>
            )}
          </div>
          <div>
            <h3 className="font-heading text-sm font-extrabold uppercase tracking-wide text-white">Follow</h3>
            <ul className="mt-3 flex gap-3">
              {SOCIALS.map((s) => {
                const Icon = SOCIAL_ICONS[s.name];
                return (
                  <li key={s.name}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.name}
                      className="flex h-11 w-11 items-center justify-center border border-white/20 text-ash transition-all duration-300 hover:border-accent hover:bg-accent hover:text-black"
                    >
                      <Icon size={18} aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-5 py-6 text-xs text-ash sm:px-8">
          &copy; {new Date().getFullYear()} Pit500, Pune. Always wear a certified helmet and ride safe.
        </p>
      </div>
    </footer>
  );
}
