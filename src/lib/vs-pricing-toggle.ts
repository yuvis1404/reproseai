/**
 * vs-pricing-toggle engine (adapted from the vividsites source for React).
 * A monthly/yearly radiogroup whose ink thumb rides a spring and stretches
 * with its speed; prices are odometer digit columns that roll one after
 * another (right-to-left when dropping, left-to-right when rising); the old
 * price strikes through and the save chip slides in on yearly. Cards lift on
 * hover with a pointer-following glow. Reduced motion: instant changes.
 */

type Period = "monthly" | "yearly";

type Spring = {
  x: number;
  v: number;
  t: number;
  k: number;
  c: number;
  delay?: number;
  apply: (s: Spring) => void;
};

interface VsPricingHandle {
  setPeriod: (p: string) => void;
}

const CELLS = 11;

export function mountPricingToggle(root: HTMLElement): () => void {
  if (root.dataset["vsReady"]) return () => {};
  root.dataset["vsReady"] = "1";

  const cleanups: Array<() => void> = [];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let period: Period = root.dataset["period"] === "yearly" ? "yearly" : "monthly";
  root.dataset["period"] = period;
  const opts = Array.from(root.querySelectorAll<HTMLButtonElement>(".vs-pricing-toggle-opt"));
  const thumb = root.querySelector<HTMLElement>(".vs-pricing-toggle-thumb");
  const cards = Array.from(root.querySelectorAll<HTMLElement>(".vs-pricing-toggle-card"));
  const badge = root.querySelector<HTMLElement>(".vs-pricing-toggle-badge");
  const badgeHome = badge?.parentElement ?? null;
  const springs: Spring[] = [];
  let raf = 0;
  let last = 0;

  const thumbS: Spring = {
    x: period === "yearly" ? 1 : 0,
    v: 0,
    t: period === "yearly" ? 1 : 0,
    k: 420,
    c: 32,
    apply: (s) => {
      if (!thumb) return;
      const st = Math.min(0.14, Math.abs(s.v) * 0.028);
      thumb.style.transform = `translate3d(${(s.x * 100).toFixed(3)}%,0,0) scale(${(1 + st).toFixed(4)},${(1 - st * 0.35).toFixed(4)})`;
    },
  };
  springs.push(thumbS);

  const ctx = document.createElement("canvas").getContext("2d");

  const prices = Array.from(root.querySelectorAll<HTMLElement>(".vs-pricing-toggle-price")).map(
    (el) => {
      const cur$ = el.dataset["currency"] ?? "$";
      const vals: Record<Period, string> = {
        monthly: String(el.dataset["monthly"] ?? ""),
        yearly: String(el.dataset["yearly"] ?? ""),
      };
      const width = Math.max(vals.monthly.length, vals.yearly.length);
      const cur = document.createElement("span");
      cur.className = "vs-pricing-toggle-cur";
      cur.textContent = cur$;
      cur.setAttribute("aria-hidden", "true");
      const digits = document.createElement("span");
      digits.className = "vs-pricing-toggle-digits";
      digits.setAttribute("aria-hidden", "true");
      const sr = document.createElement("span");
      sr.className = "vs-pricing-toggle-sr";
      el.textContent = "";
      el.append(cur, digits, sr);
      const next = el.nextElementSibling as HTMLElement | null;
      const per = next && next.classList.contains("vs-pricing-toggle-per") ? next : null;
      if (per && vals.monthly !== vals.yearly && !per.querySelector(".vs-pricing-toggle-was")) {
        const was = document.createElement("span");
        was.className = "vs-pricing-toggle-was";
        was.setAttribute("aria-hidden", "true");
        was.textContent = cur$ + vals.monthly;
        per.prepend(was);
      }
      const idx = (str: string, j: number) => {
        const ch = str.padStart(width, " ").charAt(j);
        return ch === " " ? 10 : +ch;
      };
      let W: number[] = new Array<number>(CELLS).fill(0);
      let wMax = 0;
      let total = 0;
      const cols: Array<{ s: Spring; col: HTMLElement; strip: HTMLElement }> = [];
      const place = () => {
        let x = 0;
        cols.forEach((c) => {
          const v = Math.max(0, Math.min(10, c.s.x)),
            lo = Math.floor(v),
            hi = Math.min(10, lo + 1),
            f = v - lo;
          c.col.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
          c.col.style.opacity = String(Math.max(0, Math.min(1, 10 - v)));
          x += W[lo]! + (W[hi]! - W[lo]!) * f;
        });
        if (per) per.style.transform = `translate3d(${(x - total).toFixed(2)}px,0,0)`;
      };
      const measure = () => {
        if (!ctx) return;
        const cs = getComputedStyle(digits);
        ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        const ls = parseFloat(cs.letterSpacing) || 0;
        W = [..."0123456789"].map((d) => ctx.measureText(d).width + ls).concat(0);
        wMax = Math.max(...W);
        const tot = (str: string) =>
          [...str.padStart(width, " ")].reduce((a, ch) => a + (ch === " " ? 0 : W[+ch]!), 0);
        total = Math.max(tot(vals.monthly), tot(vals.yearly));
        digits.style.width = `${total.toFixed(2)}px`;
        cols.forEach((c) => (c.col.style.width = `${(wMax + 2).toFixed(2)}px`));
        place();
      };
      for (let j = 0; j < width; j++) {
        const col = document.createElement("span");
        col.className = "vs-pricing-toggle-col";
        const strip = document.createElement("span");
        strip.className = "vs-pricing-toggle-strip";
        for (let d = 0; d < CELLS; d++) {
          const c = document.createElement("span");
          c.textContent = d < 10 ? String(d) : " ";
          strip.append(c);
        }
        col.append(strip);
        digits.append(col);
        const s: Spring = {
          x: idx(vals[period], j),
          v: 0,
          t: 0,
          k: 190,
          c: 20,
          apply: (sp) => {
            strip.style.transform = `translate3d(0,${((-sp.x / CELLS) * 100).toFixed(3)}%,0)`;
            place();
          },
        };
        s.t = s.x;
        springs.push(s);
        cols.push({ s, col, strip });
      }
      measure();
      if (document.fonts) document.fonts.ready.then(measure);
      window.addEventListener("resize", measure);
      cleanups.push(() => window.removeEventListener("resize", measure));
      const label = (p: Period) => {
        sr.textContent = `${cur$}${vals[p]} per month, billed ${p}`;
      };
      label(period);
      return {
        set: (p: Period) => {
          const up = +vals[p] > +vals[p === "yearly" ? "monthly" : "yearly"];
          cols.forEach((c, j) => {
            c.s.t = idx(vals[p], j);
            c.s.delay = (up ? j : cols.length - 1 - j) * 60;
          });
          label(p);
        },
      };
    },
  );
  springs.forEach((s) => s.apply(s));

  const tick = (now: number) => {
    const dtMs = Math.min(50, now - last);
    last = now;
    const n = Math.max(1, Math.ceil((dtMs / 1000) * 240)),
      h = dtMs / 1000 / n;
    let moving = false;
    for (const s of springs) {
      if ((s.delay ?? 0) > 0) {
        s.delay = (s.delay ?? 0) - dtMs;
        moving = true;
        continue;
      }
      if (Math.abs(s.x - s.t) < 1e-4 && Math.abs(s.v) < 1e-3) {
        if (s.x !== s.t || s.v) {
          s.x = s.t;
          s.v = 0;
          s.apply(s);
        }
        continue;
      }
      for (let i = 0; i < n; i++) {
        s.v += (-s.k * (s.x - s.t) - s.c * s.v) * h;
        s.x += s.v * h;
      }
      s.apply(s);
      moving = true;
    }
    raf = moving ? requestAnimationFrame(tick) : 0;
  };
  const syncOpts = () =>
    opts.forEach((o) => {
      const on = o.dataset["period"] === period;
      o.setAttribute("aria-checked", String(on));
      o.tabIndex = on ? 0 : -1;
    });
  const setPeriod = (p: string) => {
    const q: Period = p === "yearly" ? "yearly" : "monthly";
    if (q === period) return;
    period = q;
    if (root.dataset["period"] !== period) root.dataset["period"] = period;
    syncOpts();
    thumbS.t = period === "yearly" ? 1 : 0;
    prices.forEach((pr) => pr.set(period));
    root.dispatchEvent(new CustomEvent("vs-pricing-toggle:change", { detail: { period } }));
    if (reduce.matches) {
      springs.forEach((s) => {
        s.x = s.t;
        s.v = 0;
        s.delay = 0;
        s.apply(s);
      });
      return;
    }
    if (!raf) {
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }
  };
  const setHighlight = () => {
    const n = parseInt(root.dataset["highlight"] ?? "", 10);
    cards.forEach((c, i) => c.classList.toggle("is-featured", i + 1 === n));
    const f = isNaN(n) ? undefined : cards[n - 1];
    if (badge) {
      if (f) {
        const top = f.querySelector<HTMLElement>(".vs-pricing-toggle-top");
        if (top && badge.parentElement !== top) {
          top.append(badge);
          badge.style.animation = "none";
          void badge.offsetWidth;
          badge.style.animation = "";
        }
        badge.hidden = false;
      } else {
        badge.hidden = true;
      }
    }
  };
  syncOpts();
  setHighlight();
  opts.forEach((o) => {
    const onClick = () => setPeriod(o.dataset["period"] ?? "monthly");
    const onKey = (e: Event) => {
      const ke = e as KeyboardEvent;
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(ke.key)) return;
      ke.preventDefault();
      const other = opts.find((x) => x !== o);
      other?.focus();
      setPeriod(other?.dataset["period"] ?? "monthly");
    };
    o.addEventListener("click", onClick);
    o.addEventListener("keydown", onKey);
    cleanups.push(() => {
      o.removeEventListener("click", onClick);
      o.removeEventListener("keydown", onKey);
    });
  });
  const mo = new MutationObserver(() => {
    if (root.dataset["period"] !== period) setPeriod(root.dataset["period"] ?? "monthly");
    setHighlight();
  });
  mo.observe(root, { attributes: true, attributeFilter: ["data-period", "data-highlight"] });
  (root as HTMLElement & { vsPricing?: VsPricingHandle }).vsPricing = { setPeriod };

  cards.forEach((card) => {
    const glow = card.querySelector<HTMLElement>(".vs-pricing-toggle-glow");
    if (!glow) return;
    let pend = 0;
    const onMove = (e: Event) => {
      const pe = e as PointerEvent;
      if (pe.pointerType !== "mouse") return;
      const r = card.getBoundingClientRect();
      const x = pe.clientX - r.left,
        y = pe.clientY - r.top;
      if (!pend)
        pend = requestAnimationFrame(() => {
          pend = 0;
          glow.style.transform = `translate3d(${x}px,${y}px,0)`;
        });
    };
    card.addEventListener("pointermove", onMove);
    cleanups.push(() => {
      card.removeEventListener("pointermove", onMove);
      if (pend) cancelAnimationFrame(pend);
    });
  });

  return () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    cleanups.forEach((c) => c());
    mo.disconnect();
    if (badge && badgeHome && badge.parentElement !== badgeHome) badgeHome.append(badge);
    delete (root as HTMLElement & { vsPricing?: VsPricingHandle }).vsPricing;
    delete root.dataset["vsReady"];
  };
}
