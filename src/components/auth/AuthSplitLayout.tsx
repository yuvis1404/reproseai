import type { ReactNode } from "react";

function FloatingCards() {
  return (
    <div className="relative mt-12 hidden h-[250px] w-full max-w-md lg:block">
      <div
        className="absolute left-0 top-0 w-[230px] animate-float rounded-xl border border-brand-violet/40 bg-ink-soft/80 p-3 text-left shadow-[0_18px_45px_color-mix(in_oklab,var(--color-brand)_35%,transparent)] backdrop-blur"
        style={{ animationDuration: "7s" }}
      >
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded bg-[#0A66C2] text-[11px] font-bold text-paper">
            in
          </span>
          <span className="text-[11px] font-semibold text-paper">LinkedIn post</span>
        </div>
        <p className="mt-2 text-[11px] leading-4 text-lavender">
          The 3 habits that doubled my newsletter open rate…
        </p>
        <div className="mt-2 flex gap-3 text-[10px] text-lavender/70">
          <span>♥ 428</span>
          <span>💬 37</span>
          <span>↻ 22</span>
        </div>
      </div>

      <div
        className="absolute right-0 top-[92px] w-[200px] animate-float rounded-xl border border-brand-violet/40 bg-ink-soft/80 p-3 text-left shadow-[0_18px_45px_color-mix(in_oklab,var(--color-brand)_35%,transparent)] backdrop-blur"
        style={{ animationDuration: "9s", animationDelay: "-2s" }}
      >
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded bg-black text-[12px] font-bold text-paper">
            𝕏
          </span>
          <span className="text-[11px] font-semibold text-paper">1/8 🧵</span>
        </div>
        <p className="mt-2 text-[11px] leading-4 text-lavender">
          Everyone says “be consistent”. Nobody says how. Here's the system…
        </p>
      </div>

      <div
        className="absolute bottom-0 left-6 w-[210px] animate-float rounded-xl border border-brand-violet/40 bg-ink-soft/80 p-3 text-left shadow-[0_18px_45px_color-mix(in_oklab,var(--color-brand)_35%,transparent)] backdrop-blur"
        style={{ animationDuration: "8s", animationDelay: "-4s" }}
      >
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded bg-gradient-to-br from-[#F58529] to-[#DD2A7B] text-[11px]">
            📸
          </span>
          <span className="text-[11px] font-semibold text-paper">Slide 1 of 8</span>
        </div>
        <p className="mt-2 text-[11px] leading-4 text-lavender">
          Your voice, 8 slides, zero design work.
        </p>
      </div>
    </div>
  );
}

export function AuthSplitLayout({ children }: { children: ReactNode }) {
  return (
    <main className="font-display flex min-h-screen">
      <section className="relative hidden w-[60%] flex-col items-center justify-center overflow-hidden bg-ink px-10 lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--color-brand) 55%, transparent) 0%, transparent 68%)",
          }}
        />
        <div className="relative z-10 flex flex-col items-center text-center">
          <p className="text-[40px] font-extrabold tracking-[-1.5px] text-paper">
            ✍️ Reprose <span className="text-gradient-brand">AI</span>
          </p>
          <p className="mt-3 text-[18px] font-medium text-lavender">
            One Post. Every Platform.
          </p>
          <FloatingCards />
        </div>
      </section>

      <section className="flex w-full flex-col items-center justify-center bg-paper px-5 py-14 sm:px-10 lg:w-[40%]">
        <p className="mb-8 text-[22px] font-extrabold tracking-[-0.5px] text-ink lg:hidden">
          ✍️ Reprose <span className="text-gradient-brand">AI</span>
        </p>
        <div className="w-full max-w-[380px]">{children}</div>
      </section>
    </main>
  );
}
