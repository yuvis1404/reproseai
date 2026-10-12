import { cn } from "@/lib/utils";

/**
 * Cool motion gradient background: blurred brand-colored blobs drifting
 * on independent loops, plus a faint rotating conic sheen. Sits behind
 * section content and is purely decorative.
 */
export function MotionGradientBackground({ subtle = false }: { subtle?: boolean }) {
  return (
    <div className={cn("aurora-field", subtle && "aurora-field--subtle")} aria-hidden="true">
      <span className="aurora-blob aurora-blob--brand" />
      <span className="aurora-blob aurora-blob--violet" />
      {!subtle && <span className="aurora-blob aurora-blob--blue" />}
      <span className="aurora-sheen" />
    </div>
  );
}
