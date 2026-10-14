/**
 * vs-stack-cards engine (adapted from the vividsites source for React).
 * Sticky cards stack into a deck: buried cards sink back on a spring
 * (scale, lift, dim) leaving their index tab showing as a scroll-back
 * button; the card in flight leans with scroll velocity. Layout is read
 * once (plus resize/style changes); scrolling does transform/opacity
 * writes only, in one rAF that sleeps when the springs settle and while
 * the stack is off screen. Reduced motion: stacking without scale, lean
 * or reveal.
 */

interface StackCard {
  el: HTMLElement;
  i: number;
  inner: HTMLElement | null;
  shade: HTMLElement | null;
  img: HTMLImageElement | null;
  tab: HTMLButtonElement | null;
  d: number;
  dv: number;
  t: number;
  tv: number;
  blur: number;
  buried: boolean;
}

interface VsStackCardsHandle {
  go: (i: number, behavior?: ScrollBehavior) => void;
  measure: () => void;
}

export function mountStackCards(root: HTMLElement): () => void {
  if (root.dataset["vsReady"]) return () => {};
  root.dataset["vsReady"] = "1";

  const cleanups: Array<() => void> = [];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

  const cards: StackCard[] = Array.from(
    root.querySelectorAll<HTMLElement>(".vs-stack-cards-card"),
  ).map((el, i) => {
    el.style.setProperty("--i", String(i));
    return {
      el,
      i,
      inner: el.querySelector<HTMLElement>(".vs-stack-cards-inner"),
      shade: el.querySelector<HTMLElement>(".vs-stack-cards-shade"),
      img: el.querySelector<HTMLImageElement>(".vs-stack-cards-media img"),
      tab: el.querySelector<HTMLButtonElement>(".vs-stack-cards-tab"),
      d: 0,
      dv: 0,
      t: 0,
      tv: 0,
      blur: -1,
      buried: false,
    };
  });
  const n = cards.length;
  if (!n) {
    delete root.dataset["vsReady"];
    return () => {};
  }
  root.style.setProperty("--vs-stack-cards-n", String(n));

  let pins: number[] = [];
  let spans: number[] = [];
  let depthK = 0.05;
  let dimMax = 0.55;
  let blurMax = 0;
  let lift = 7;
  const measure = () => {
    const cs = getComputedStyle(root);
    depthK = parseFloat(cs.getPropertyValue("--vs-stack-cards-depth"));
    if (isNaN(depthK)) depthK = 0.05;
    dimMax = parseFloat(cs.getPropertyValue("--vs-stack-cards-dim"));
    if (isNaN(dimMax)) dimMax = 0.45;
    blurMax = parseFloat(cs.getPropertyValue("--vs-stack-cards-blur")) || 0;
    const first = cards[0]!;
    const H = first.el.offsetHeight;
    const G = n > 1 ? parseFloat(getComputedStyle(cards[1]!.el).marginTop) || 0 : 0;
    const top0 = root.getBoundingClientRect().top + window.scrollY;
    const tops = cards.map((c) => parseFloat(getComputedStyle(c.el).top) || 0);
    pins = cards.map((c, i) => top0 + i * (H + G) - tops[i]!);
    spans = cards.map((c, i) => Math.max(1, i ? H + G - (tops[i]! - tops[i - 1]!) : 1));
    lift = Math.max(2, (tops[1]! - tops[0]!) * 0.2 || 6);
  };

  let sy = window.scrollY;
  let vel = 0;
  let lastT = 0;
  let raf = 0;
  let on = false;
  let settleFrames = 0;
  const K = 260,
    C = 28,
    KT = 180,
    CT = 20;
  const frame = (now: number) => {
    raf = 0;
    const dt = Math.min(0.05, lastT ? (now - lastT) / 1000 : 1 / 60);
    lastT = now;
    const s = window.scrollY;
    const inst = (s - sy) / Math.max(dt, 1e-3);
    sy = s;
    vel += (inst - vel) * Math.min(1, dt * 12);
    const prog = cards.map((c, i) =>
      i === 0
        ? s >= pins[0]! - 1
          ? 1
          : clamp(1 - (pins[0]! - s) / 400, 0, 1)
        : clamp(1 - (pins[i]! - s) / spans[i]!, 0, 1),
    );
    let moving = false;
    let top = 0;
    const steps = Math.max(1, Math.ceil(dt * 240)),
      h = dt / steps;
    cards.forEach((c, i) => {
      let target = 0;
      for (let j = i + 1; j < n; j++) target += prog[j]!;
      const inFlight = prog[i]! > 0 && prog[i]! < 1;
      const tiltT = inFlight ? clamp(-vel * 0.0024, -5, 5) : 0;
      if (reduce.matches) {
        c.d = target;
        c.dv = 0;
        c.t = 0;
      } else {
        for (let k = 0; k < steps; k++) {
          c.dv += (-K * (c.d - target) - C * c.dv) * h;
          c.d += c.dv * h;
          c.tv += (-KT * (c.t - tiltT) - CT * c.tv) * h;
          c.t += c.tv * h;
        }
      }
      if (
        Math.abs(c.d - target) > 1e-4 ||
        Math.abs(c.dv) > 1e-3 ||
        Math.abs(c.t - tiltT) > 1e-3 ||
        Math.abs(c.tv) > 1e-2
      )
        moving = true;
      if (prog[i]! > 0.985) top = i;
      if (!c.el.classList.contains("is-in") && prog[i]! > 0.45) c.el.classList.add("is-in");
      const d = Math.max(0, c.d);
      if (c.inner)
        c.inner.style.transform = reduce.matches
          ? ""
          : `translate3d(0,${(-d * lift).toFixed(2)}px,0) perspective(1600px) rotateX(${c.t.toFixed(3)}deg) scale(${(1 - d * depthK).toFixed(4)})`;
      if (c.shade) c.shade.style.opacity = Math.min(dimMax, d * dimMax * 0.55).toFixed(3);
      if (blurMax > 0) {
        const b = Math.round(Math.min(blurMax, d * blurMax * 0.6) * 4) / 4;
        if (b !== c.blur) {
          c.blur = b;
          if (c.inner) c.inner.style.filter = b ? `blur(${b}px)` : "";
        }
      } else if (c.blur !== -1) {
        c.blur = -1;
        if (c.inner) c.inner.style.filter = "";
      }
      if (c.img && !reduce.matches)
        c.img.style.transform = `translate3d(0,${((1 - prog[i]!) * 4 - 2).toFixed(2)}%,0)`;
      const buried = d > 0.5;
      if (buried !== c.buried) {
        c.buried = buried;
        c.el.classList.toggle("is-buried", buried);
        if (c.tab) c.tab.tabIndex = buried ? 0 : -1;
      }
    });
    root.dataset["top"] = String(top);
    if (Math.abs(vel) > 2) moving = true;
    if (moving || settleFrames-- > 0) raf = requestAnimationFrame(frame);
    else lastT = 0;
  };
  const wake = () => {
    settleFrames = 3;
    if (!raf) raf = requestAnimationFrame(frame);
  };
  const io = new IntersectionObserver(
    (entries) => {
      const e = entries[0];
      if (!e) return;
      if (e.isIntersecting && !on) {
        on = true;
        window.addEventListener("scroll", wake, { passive: true });
        wake();
      } else if (!e.isIntersecting && on) {
        on = false;
        window.removeEventListener("scroll", wake);
      }
    },
    { rootMargin: "20% 0px" },
  );
  io.observe(root);
  const go = (i: number, behavior?: ScrollBehavior) =>
    window.scrollTo({
      top: pins[clamp(i, 0, n - 1)]! + 1,
      behavior: behavior ?? (reduce.matches ? "auto" : "smooth"),
    });
  cards.forEach((c) => {
    if (!c.tab) return;
    c.tab.tabIndex = -1;
    const onClick = () => {
      if (c.buried) go(c.i);
    };
    c.tab.addEventListener("click", onClick);
    cleanups.push(() => c.tab?.removeEventListener("click", onClick));
  });
  const mo = new MutationObserver(() => {
    measure();
    wake();
  });
  mo.observe(root, { attributes: true, attributeFilter: ["style"] });
  const ro = new ResizeObserver(() => {
    measure();
    wake();
  });
  ro.observe(root);
  (root as HTMLElement & { vsStackCards?: VsStackCardsHandle }).vsStackCards = { go, measure };
  measure();
  sy = window.scrollY;
  frame(performance.now());

  return () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    cleanups.forEach((fn) => fn());
    io.disconnect();
    mo.disconnect();
    ro.disconnect();
    if (on) window.removeEventListener("scroll", wake);
    delete (root as HTMLElement & { vsStackCards?: VsStackCardsHandle }).vsStackCards;
    delete root.dataset["vsReady"];
    root.style.removeProperty("--vs-stack-cards-n");
  };
}
