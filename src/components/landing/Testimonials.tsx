import { Reveal } from "./Reveal";

const testimonials = [
  {
    quote:
      "I spent 8 hours writing my newsletter every week. Now I get LinkedIn posts, threads, AND carousels in the same session. It's genuinely changed how I think about content.",
    name: "Alex M.",
    platform: "Substack — 3.2K subscribers",
    initial: "A",
    tone: "bg-brand",
  },
  {
    quote:
      "The voice training feature is what sold me. Every other AI tool sounded robotic. Reprose actually sounds like me. My subscribers couldn't tell the difference.",
    name: "Sarah K.",
    platform: "Beehiiv — 1.1K subscribers",
    initial: "S",
    tone: "bg-brand-violet",
  },
  {
    quote:
      "I went from 400 to 2,100 LinkedIn followers in 6 weeks just by consistently sharing my newsletter content. Reprose made that possible without any extra writing.",
    name: "Marcus T.",
    platform: "Ghost — 5K readers",
    initial: "M",
    tone: "bg-brand-deep",
  },
];

export function Testimonials() {
  return (
    <section className="bg-gradient-to-b from-ink-soft to-ink px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="text-center text-[32px] font-bold tracking-[-1px] text-paper md:text-[48px] md:leading-[56px]">
            Writers love Reprose
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-[18px] leading-8 text-lavender">
            Join 500+ newsletter writers saving 6+ hours every week
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 100} className="h-full">
              <figure className="flex h-full flex-col rounded-2xl border border-paper/10 bg-paper/[0.05] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40">
                <p aria-label="Rated 5 out of 5" className="text-[14px]">
                  ⭐⭐⭐⭐⭐
                </p>
                <blockquote className="mt-4 flex-1 text-[16px] italic leading-7 text-paper">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={`grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold text-paper ${t.tone}`}
                  >
                    {t.initial}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-bold text-paper">{t.name}</span>
                    <span className="block text-[14px] text-lavender">{t.platform}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-center text-[13px] italic text-gray-muted">
          * Testimonials are representative examples. Replace with real user quotes from
          beta.
        </p>
      </div>
    </section>
  );
}