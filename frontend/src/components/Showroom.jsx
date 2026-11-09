import { useEffect, useState } from 'react';
import { MapPin, Clock, MessageCircle, Navigation } from 'lucide-react';
import { buildWhatsAppLink } from '../defaults.js';

// Reads the first two clock times from free text such as "Mon - Sun: 10:00 AM - 9:00 PM".
function parseHours(text = '') {
  const re = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)/gi;
  const times = [];
  let m;
  while ((m = re.exec(text)) && times.length < 2) {
    let h = Number(m[1]) % 12;
    if (m[3].toLowerCase() === 'pm') h += 12;
    times.push(h * 60 + Number(m[2] || 0));
  }
  return times.length === 2 ? { open: times[0], close: times[1] } : null;
}

function nowInIndia() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());
  const get = (t) => Number(parts.find((p) => p.type === t).value);
  return (get('hour') % 24) * 60 + get('minute');
}

function useOpenStatus(timings) {
  const [now, setNow] = useState(nowInIndia);
  useEffect(() => {
    const id = setInterval(() => setNow(nowInIndia()), 60000);
    return () => clearInterval(id);
  }, []);
  const hours = parseHours(timings);
  if (!hours) return null;
  const { open, close } = hours;
  return open <= close ? now >= open && now < close : now >= open || now < close;
}

export default function Showroom({ address, timings, whatsappNumber }) {
  const isOpen = useOpenStatus(timings);
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <section id="visit" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
      <h2 className="font-heading text-3xl font-black uppercase tracking-tight sm:text-5xl">Visit the showroom</h2>

      <div className="mt-12 grid gap-8 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-2">
          <div className="border border-white/10 bg-charcoal p-6 transition-colors duration-300 hover:border-accent">
            <div className="flex items-start gap-4">
              <MapPin className="mt-1 shrink-0 text-accent" size={24} aria-hidden="true" />
              <div>
                <h3 className="font-heading text-lg font-extrabold uppercase">Address</h3>
                <p className="mt-2 leading-relaxed text-ash">{address}</p>
              </div>
            </div>
          </div>

          <div className="border border-white/10 bg-charcoal p-6 transition-colors duration-300 hover:border-accent">
            <div className="flex items-start gap-4">
              <Clock className="mt-1 shrink-0 text-accent" size={24} aria-hidden="true" />
              <div>
                <h3 className="font-heading text-lg font-extrabold uppercase">Opening hours</h3>
                <p className="mt-2 text-ash">{timings}</p>
                {isOpen !== null && (
                  <p
                    className={`mt-3 inline-flex items-center gap-2 border px-3 py-1 text-sm font-semibold ${
                      isOpen ? 'border-emerald-500/50 text-emerald-400' : 'border-white/20 text-ash'
                    }`}
                    role="status"
                  >
                    <span className={`h-2 w-2 rounded-full ${isOpen ? 'animate-pulse bg-emerald-400' : 'bg-ash'}`} aria-hidden="true" />
                    {isOpen ? 'Open now' : 'Closed right now'}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-accent px-5 py-3 text-sm font-bold uppercase tracking-wide text-black transition-all duration-300 hover:bg-white"
            >
              <Navigation size={16} aria-hidden="true" />
              Get directions
            </a>
            <a
              href={buildWhatsAppLink(whatsappNumber, 'Hi Pit500, I plan to visit the store. Can you confirm timings?')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-white/25 px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition-all duration-300 hover:border-accent hover:text-accent"
            >
              <MessageCircle size={16} aria-hidden="true" />
              Message us
            </a>
          </div>
        </div>

        {/* Map slot. To embed Google Maps, replace this block with your iframe from Share > Embed a map. */}
        <div className="carbon relative flex min-h-[20rem] items-center justify-center border border-white/10 lg:col-span-3">
          <svg className="absolute inset-0 h-full w-full opacity-30" aria-hidden="true">
            <defs>
              <pattern id="streets" width="64" height="64" patternUnits="userSpaceOnUse">
                <path d="M0 32H64M32 0V64" stroke="#9CA3AF" strokeWidth="1" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#streets)" />
          </svg>
          <div className="relative flex flex-col items-center px-6 text-center">
            <span className="flex h-14 w-14 animate-ring items-center justify-center rounded-full bg-accent text-black">
              <MapPin size={26} aria-hidden="true" />
            </span>
            <p className="mt-4 font-heading text-lg font-extrabold uppercase">Pit500, Baner Road</p>
            <p className="mt-1 max-w-xs text-sm text-ash">Map embed slot. Use Get directions to open live navigation.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
