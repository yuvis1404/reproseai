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
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-[14px] text-gray-muted">Trusted by writers publishing on</p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {platforms.map((p) => (
            <li
              key={p}
              className="text-[16px] font-semibold text-paper opacity-50 transition-opacity duration-300 hover:opacity-100"
            >
              {p}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}