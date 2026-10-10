import { cn } from "@/lib/utils";

const CELLS = 22;
const CELL = 40;
const TILE_W = CELLS * CELL;
const TILE_H = 160;

/* Seamless stepped-dune silhouette: starts and ends at the same height so
 * the drifting track never shows a seam. */
const HEIGHTS = [1, 1, 2, 2, 3, 3, 4, 4, 4, 3, 3, 2, 2, 1, 1, 0, 0, 0, 0, 1, 1, 1];

function DuneTile() {
  const rects: React.ReactNode[] = [];
  for (let c = 0; c < CELLS; c++) {
    const h = HEIGHTS[c] ?? 0;
    for (let r = 0; r < h; r++) {
      rects.push(
        <rect
          key={`${c}-${r}`}
          x={c * CELL}
          y={TILE_H - (r + 1) * CELL}
          width={CELL}
          height={CELL}
        />,
      );
    }
  }
  return (
    <svg
      width={TILE_W}
      height={TILE_H}
      viewBox={`0 0 ${TILE_W} ${TILE_H}`}
      className="block h-auto w-auto max-w-none shrink-0"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="currentColor">{rects}</g>
    </svg>
  );
}

/**
 * Symboolic-style pixel dune strip: a seamless row of pixel-art tiles that
 * drifts horizontally forever. Color the wrapper's text to match the
 * section the dunes "rise into"; the wrapper bg matches the section above.
 */
export function PixelDunes({
  className,
  reverse = false,
  slow = false,
}: {
  className?: string;
  reverse?: boolean;
  slow?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none select-none overflow-hidden", className)}
    >
      <div
        className={cn("dune-track", reverse && "dune-track--reverse", slow && "dune-track--slow")}
      >
        {Array.from({ length: 6 }, (_, i) => (
          <DuneTile key={i} />
        ))}
      </div>
    </div>
  );
}
