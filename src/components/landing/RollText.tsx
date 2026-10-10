import type { ReactNode } from "react";

const LINE_EM = 1.4;

function RollChar({ char }: { char: string }) {
  return (
    <span
      aria-hidden="true"
      className="roll-char"
      style={{ height: `${LINE_EM}em`, lineHeight: LINE_EM }}
    >
      <span className="roll-char-roller">
        <span className="block" style={{ height: `${LINE_EM}em`, lineHeight: LINE_EM }}>
          {char}
        </span>
        <span className="block" style={{ height: `${LINE_EM}em`, lineHeight: LINE_EM }}>
          {char}
        </span>
      </span>
    </span>
  );
}

function RollArrow({ children }: { children: ReactNode }) {
  return (
    <span aria-hidden="true" className="roll-arrow" style={{ width: "1em", height: "1em" }}>
      <span className="roll-arrow-roller">
        <span className="absolute right-0 top-0 grid size-[1em] place-items-center">
          {children}
        </span>
        <span className="absolute bottom-0 left-0 grid size-[1em] place-items-center">
          {children}
        </span>
      </span>
    </span>
  );
}

/**
 * Symboolic-style hover text: every character sits in its own clip window
 * and rolls up on hover, revealing a duplicate underneath. Arrows roll
 * diagonally instead, exiting toward the top-right.
 */
export function RollText({ text }: { text: string }) {
  const parts = text.split(/(\s+|→|↓)/g).filter(Boolean);

  return (
    <span className="roll-text">
      {parts.map((part, i) => {
        if (part === "→" || part === "↓") return <RollArrow key={i}>{part}</RollArrow>;
        if (/^\s+$/.test(part))
          return (
            <span key={i} aria-hidden="true" className="inline-block whitespace-pre">
              {part}
            </span>
          );
        return (
          <span key={i} className="inline-block whitespace-nowrap">
            {part.split("").map((char, j) => (
              <RollChar key={j} char={char} />
            ))}
          </span>
        );
      })}
      <span className="sr-only">{text}</span>
    </span>
  );
}
