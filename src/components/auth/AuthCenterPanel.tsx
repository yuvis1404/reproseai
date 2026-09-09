import type { ReactNode } from "react";

import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export function AuthCenterPanel({ children }: { children: ReactNode }) {
  const cardRef = useScrollAnimation<HTMLDivElement>();

  return (
    <main className="font-display flex min-h-screen items-center justify-center bg-[oklch(0.97_0.005_285)] px-5 py-16">
      <div
        ref={cardRef}
        className="scroll-animate-scale w-full max-w-[480px] rounded-2xl border border-[oklch(0.93_0.01_285)] bg-paper p-8 text-center shadow-[0_24px_60px_rgba(13,10,26,0.08)] sm:p-10"
      >
        {children}
      </div>
    </main>
  );
}
