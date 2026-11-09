import { useEffect, useState } from 'react';
import Logo from './Logo.jsx';

const KEY = 'pit500_intro_seen';

function alreadySeen() {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
    return window.sessionStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

// Full-screen logo intro. Plays once per browser session, never for reduced-motion users.
export default function Splash() {
  const [phase, setPhase] = useState(() => (alreadySeen() ? 'gone' : 'show')); // show | leaving | gone

  useEffect(() => {
    if (phase === 'gone') return undefined;
    try {
      window.sessionStorage.setItem(KEY, '1');
    } catch {
      /* ignore */
    }
    const leave = setTimeout(() => setPhase('leaving'), 2300);
    const done = setTimeout(() => setPhase('gone'), 3000);
    return () => {
      clearTimeout(leave);
      clearTimeout(done);
    };
  }, [phase === 'gone']); // eslint-disable-line react-hooks/exhaustive-deps

  if (phase === 'gone') return null;

  return (
    <div
      className={`fixed inset-0 z-[70] flex flex-col items-center justify-center bg-asphalt transition-all duration-700 ${
        phase === 'leaving' ? 'pointer-events-none -translate-y-6 opacity-0' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      <Logo size="lg" />
      <div className="mt-10 h-0.5 w-48 overflow-hidden bg-white/10">
        <div className="h-full origin-left animate-[splashBar_2.2s_ease-in-out_forwards] bg-accent" />
      </div>
    </div>
  );
}
