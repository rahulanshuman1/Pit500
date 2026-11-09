import Reveal from './Reveal.jsx';
import { ShieldCheck, Truck, Users } from 'lucide-react';

const PILLARS = [
  {
    Icon: ShieldCheck,
    title: 'Tested before it is stocked',
    text: 'Helmets, armour and luggage go through fit, comfort and certification checks by riders who use them on track and street.',
  },
  {
    Icon: Truck,
    title: 'Pan-India delivery',
    text: 'Insured shipping from Pune to every serviceable pin code, packed to arrive ready to ride, with easy size exchanges.',
  },
  {
    Icon: Users,
    title: 'Family-run, rider-led',
    text: 'You deal with the people who own the store. We fit you properly and tell you when a cheaper option is the right one.',
  },
];

export default function About() {
  return (
    <section id="about" className="border-y border-white/10 bg-charcoal">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-5">
        <Reveal direction="left" className="lg:col-span-2">
          <h2 className="font-heading text-3xl font-black uppercase leading-tight tracking-tight sm:text-5xl">
            Built by riders, for riders
          </h2>
          <p className="mt-6 leading-relaxed text-ash">
            Pit500 is a family-run gear destination in Pune for people who ride hard, whether that is a track day at weekends or a
            daily commute through Baner traffic. We stock fewer brands than a mall, and we can explain why each one is on the shelf.
          </p>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-3 lg:col-span-3">
          {PILLARS.map(({ Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 150} direction="right" className="h-full">
            <article
              className="h-full border-t-2 border-accent bg-asphalt p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-black"
            >
              <Icon size={30} strokeWidth={1.5} className="text-accent" aria-hidden="true" />
              <h3 className="mt-5 font-heading text-lg font-extrabold uppercase leading-snug">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ash">{text}</p>
            </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
