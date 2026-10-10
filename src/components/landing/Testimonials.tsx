import { Star } from "lucide-react";
import { Reveal, SectionLabel } from "./Reveal";

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
    <section className="bg-ink px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionLabel>The writer’s perspective</SectionLabel>
          <h2 className="premium-section-title mt-4 text-center text-paper">
            Less rewriting. More reaching.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-[18px] leading-8 text-lavender">
            Join 500+ newsletter writers saving 6+ hours every week
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 100} className="h-full">
              <figure className="premium-testimonial card-hover flex h-full flex-col rounded-lg border border-paper/10 bg-paper/[0.03] p-7">
                <p aria-label="Rated 5 out of 5" className="flex gap-1 text-lavender">
                  {Array.from({ length: 5 }, (_, index) => <Star key={index} className="size-3.5 fill-current" aria-hidden="true" />)}
                </p>
                <blockquote className="mt-6 flex-1 text-[15px] leading-7 text-paper/85">
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