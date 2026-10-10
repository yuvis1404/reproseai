import { useEffect } from "react";

type Layer = {
  element: HTMLElement;
  section: HTMLElement;
  depth: number;
  limit: number;
  top: number;
  height: number;
  current: number;
};

/** Independent translate composes with existing entrance and hover transforms. */
export function LandingParallax() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".landing-page");
    if (!root || typeof IntersectionObserver === "undefined") return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let stop = () => {};

    const start = () => {
      stop();
      if (motion.matches) return;

      const layers: Layer[] = [];
      const sections = Array.from(root.querySelectorAll<HTMLElement>("main > section"));
      const active = new Set<HTMLElement>();
      let frame = 0;
      let disposed = false;
      let viewport = window.innerHeight;

      const add = (section: HTMLElement, selector: string, depth: number, limit: number) => {
        section.querySelectorAll<HTMLElement>(selector).forEach((element) => {
          element.classList.add("landing-depth-layer");
          layers.push({ element, section, depth, limit, top: 0, height: 0, current: 0 });
        });
      };

      sections.forEach((section, index) => {
        if (index === 0) {
          add(section, ".grid-overlay", 0.18, 120);
          add(section, "h1", 0.085, 48);
          add(section, ".hero-mockup-enter", -0.055, 32);
        } else {
          // Different foreground depths without changing any grid positions.
          add(section, ".scroll-reveal:not(.h-full)", 0.026, 16);
          section.querySelectorAll<HTMLElement>(".scroll-reveal.h-full").forEach((element, i) => {
            element.classList.add("landing-depth-layer");
            layers.push({ element, section, depth: [-0.025, 0.015, -0.018][i % 3] ?? -0.018, limit: 18, top: 0, height: 0, current: 0 });
          });
        }
      });

      const measure = () => {
        viewport = window.innerHeight;
        const positions = new Map(sections.map((section) => {
          const rect = section.getBoundingClientRect();
          return [section, { top: rect.top + window.scrollY, height: rect.height }];
        }));
        layers.forEach((layer) => {
          const position = positions.get(layer.section);
          if (position) Object.assign(layer, position);
        });
      };

      const render = () => {
        frame = 0;
        if (disposed) return;
        let settling = false;
        const scroll = window.scrollY;
        const mobile = window.innerWidth < 768 ? 0.4 : 1;
        layers.forEach((layer) => {
          if (!active.has(layer.section)) return;
          const origin = layer.section === sections[0] ? 0 : layer.top + layer.height / 2 - viewport / 2;
          const distance = (scroll - origin) * layer.depth * mobile;
          const target = Math.max(-layer.limit * mobile, Math.min(layer.limit * mobile, distance));
          layer.current += (target - layer.current) * 0.14;
          if (Math.abs(target - layer.current) > 0.05) settling = true;
          layer.element.style.setProperty("--landing-depth-y", `${layer.current.toFixed(2)}px`);
        });
        if (settling) frame = window.requestAnimationFrame(render);
      };
      const schedule = () => { if (!frame) frame = window.requestAnimationFrame(render); };
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const section = entry.target as HTMLElement;
          if (entry.isIntersecting) active.add(section);
          else active.delete(section);
        });
        schedule();
      }, { rootMargin: "180px 0px" });

      measure();
      sections.forEach((section) => observer.observe(section));
      const resize = () => { measure(); schedule(); };
      const sizeObserver = new ResizeObserver(resize);
      sections.forEach((section) => sizeObserver.observe(section));
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", resize);

      stop = () => {
        disposed = true;
        observer.disconnect();
        sizeObserver.disconnect();
        window.cancelAnimationFrame(frame);
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", resize);
        layers.forEach(({ element }) => {
          element.classList.remove("landing-depth-layer");
          element.style.removeProperty("--landing-depth-y");
        });
      };
    };
    start();
    motion.addEventListener("change", start);
    return () => { stop(); motion.removeEventListener("change", start); };
  }, []);

  return null;
}