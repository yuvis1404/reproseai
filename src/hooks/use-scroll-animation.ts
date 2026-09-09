import { useEffect, useRef } from "react";

// Scroll-reveal animation hook. Attach the returned ref to any element that
// has a `.scroll-animate*` class (plus an optional `.stagger-N`). The first
// time the element becomes 12% visible in the viewport the `animate-in` class
// is added; the observer is then disconnected so the animation plays only once
// and never replays when scrolling back up.
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // No-IO fallback: show the element immediately.
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("animate-in");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("animate-in");
            observer.disconnect();
          }
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}