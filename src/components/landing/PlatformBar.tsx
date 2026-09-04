import { Reveal } from "./Reveal";

const platforms = [
  "📧 Substack",
  "🐝 Beehiiv",
  "👻 Ghost",
  "📰 Medium",
  "🌐 WordPress",
];

export function PlatformBar() {
  return (
    <section className="bg-ink px-5 pb-24">
      <Reveal className="mx-auto max-w-4xl text-center">
        <p className="text-[14px] text-gray-muted">Trusted by writers publishing on</p>
        <div className="mt-6 overflow-hidden">
          <ul className="flex w-max animate-marquee items-center gap-x-8 hover:[animation-play-state:paused]">
            {[...platforms, ...platforms].map((p, i) => (
              <li
                key={`${p}-${i}`}
                className="text-[16px] font-semibold text-paper opacity-50 transition-opacity duration-300 hover:opacity-100"
              >
                {p}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
