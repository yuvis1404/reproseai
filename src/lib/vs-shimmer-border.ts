/**
 * vs-shimmer-border engine (adapted from the vividsites source for React).
 * A comet of light travels the true perimeter of a rounded rect at constant
 * speed, trailing a tapered tail, spilling glow and lighting the button's
 * inside as it passes. Hover summons a twin comet plus a pointer-tracking
 * rim spotlight; press flares the whole rim. Reduced motion parks the
 * comet; the loop pauses off-screen and in hidden tabs.
 */

type SizedNode = HTMLElement & { __z?: number };

interface Api {
  update(dt: number): boolean;
}

interface Spring {
  x: number;
  v: number;
  g: number;
  k: number;
  c: number;
}

interface Comet {
  dots: SizedNode[];
  glows: SizedNode[];
  spill: SizedNode;
}

interface Springs {
  speed: Spring;
  twin: Spring;
  fl: Spring;
  br: Spring;
}

const K = 14;
const mounted = new WeakSet<HTMLElement>();
const live = new Set<Api>();
let raf = 0;
let last = 0;

const tick = (now: number) => {
  const dt = Math.min(0.064, (now - last) / 1000 || 0.016);
  last = now;
  for (const c of live) if (!c.update(dt)) live.delete(c);
  raf = live.size ? requestAnimationFrame(tick) : 0;
};

const wake = (c: Api) => {
  live.add(c);
  if (!raf) {
    last = performance.now();
    raf = requestAnimationFrame(tick);
  }
};

function outline(W: number, H: number, r0: number) {
  const r = Math.min(r0, W / 2, H / 2);
  const a = W - 2 * r,
    b = H - 2 * r,
    q = (Math.PI * r) / 2,
    P = 2 * a + 2 * b + 4 * q;
  const arc = (cx: number, cy: number, a0: number, t: number): [number, number] => [
    cx + r * Math.cos(a0 + t / r),
    cy + r * Math.sin(a0 + t / r),
  ];
  const at = (s0: number): [number, number] => {
    let s = ((s0 % P) + P) % P;
    if (s < a) return [r + s, 0];
    s -= a;
    if (s < q) return arc(W - r, r, -Math.PI / 2, s);
    s -= q;
    if (s < b) return [W, r + s];
    s -= b;
    if (s < q) return arc(W - r, H - r, 0, s);
    s -= q;
    if (s < a) return [W - r - s, H];
    s -= a;
    if (s < q) return arc(r, H - r, Math.PI / 2, s);
    s -= q;
    if (s < b) return [0, H - r - s];
    s -= b;
    return arc(r, r, Math.PI, s);
  };
  return { P, at };
}

export function mountShimmerBorder(el: HTMLElement): () => void {
  if (mounted.has(el)) return () => {};
  mounted.add(el);

  const mk = (cls: string, parent?: HTMLElement) => {
    const n = document.createElement("span");
    n.className = cls;
    if (parent) parent.appendChild(n);
    return n;
  };

  const body = mk("vs-shimmer-border-body");
  const label = mk("vs-shimmer-border-label");
  while (el.firstChild) label.appendChild(el.firstChild);
  body.appendChild(label);
  body.insertAdjacentHTML(
    "beforeend",
    '<svg class="vs-shimmer-border-spin" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/></svg>',
  );
  const ring = mk("vs-shimmer-border-ring"),
    glow = mk("vs-shimmer-border-glow");
  const flash = mk("vs-shimmer-border-flash", ring),
    spot = mk("vs-shimmer-border-spot", ring);
  [ring, glow].forEach((n) => n.setAttribute("aria-hidden", "true"));
  el.append(glow, body, ring);

  const comets: Comet[] = [0, 1].map(() => {
    const dots: SizedNode[] = [],
      glows: SizedNode[] = [];
    for (let i = 0; i < K; i++) {
      const d = mk("vs-shimmer-border-dot", ring) as SizedNode;
      d.style.setProperty("--t", `${Math.round(Math.min(1, i / 4) * 100)}%`);
      dots.push(d);
      if (i % 2 === 0) {
        const g = d.cloneNode() as SizedNode;
        g.style.setProperty("--t", i ? "100%" : "55%");
        glow.appendChild(g);
        glows.push(g);
      }
    }
    const spill = mk("vs-shimmer-border-spill") as SizedNode;
    body.insertBefore(spill, label);
    return { dots, glows, spill };
  });

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let W = 0,
    H = 0,
    path: { P: number; at: (s: number) => [number, number] } | null = null,
    s = 0,
    visible = true,
    period = 3.6,
    tailF = 0.26;

  const readAttrs = () => {
    period = Math.max(0.4, parseFloat(el.dataset["period"] ?? "") || 3.6);
    tailF = Math.min(0.9, Math.max(0.05, parseFloat(el.dataset["tail"] ?? "") || 0.26));
    wake(api);
  };
  const measure = () => {
    W = el.offsetWidth;
    H = el.offsetHeight;
    path = outline(W, H, parseFloat(getComputedStyle(body).borderTopLeftRadius) || 0);
    const sz = Math.max(28, H * 1.15);
    comets.forEach((c) => {
      c.dots.forEach((d, i) => {
        const z = sz * (1 - (i / K) * 0.45);
        d.style.width = `${z}px`;
        d.style.height = `${z}px`;
        d.__z = z;
      });
      c.glows.forEach((d, i) => {
        const z = sz * 0.62 * (1 - (i / K) * 0.5);
        d.style.width = `${z}px`;
        d.style.height = `${z}px`;
        d.__z = z;
      });
      const z = Math.max(W, H) * 0.9;
      c.spill.style.width = `${z}px`;
      c.spill.style.height = `${z}px`;
      c.spill.__z = z;
    });
    wake(api);
  };
  const ro = new ResizeObserver(measure);
  ro.observe(el);

  const sp = (x: number, k: number, c: number): Spring => ({ x, v: 0, g: x, k, c });
  const S: Springs = {
    speed: sp(1, 60, 14),
    twin: sp(0, 90, 18),
    fl: sp(0, 240, 26),
    br: sp(0.8, 90, 18),
  };
  const place = (c: Comet, headS: number, amp: number) => {
    if (!path) return;
    const p = path;
    const tail = p.P * tailF,
      gap = tail / K;
    c.dots.forEach((d, i) => {
      const [x, y] = p.at(headS - i * gap);
      const z = d.__z ?? 0;
      d.style.transform = `translate3d(${(x - z / 2).toFixed(1)}px,${(y - z / 2).toFixed(1)}px,0)`;
      d.style.opacity = (amp * Math.pow(1 - i / K, 1.5)).toFixed(3);
    });
    c.glows.forEach((d, j) => {
      const i = j * 2;
      const [x, y] = p.at(headS - i * gap);
      const z = d.__z ?? 0;
      d.style.transform = `translate3d(${(x - z / 2).toFixed(1)}px,${(y - z / 2).toFixed(1)}px,0)`;
      d.style.opacity = (amp * Math.pow(1 - i / K, 2)).toFixed(3);
    });
    const [x, y] = p.at(headS - gap * 2);
    const z = c.spill.__z ?? 0;
    c.spill.style.transform = `translate3d(${(x - z / 2).toFixed(1)}px,${(y - z / 2).toFixed(1)}px,0)`;
    c.spill.style.opacity = Math.min(1, amp).toFixed(3);
  };
  const api: Api = {
    update(dt) {
      if (!path || !W) return false;
      let settling = false;
      for (const q of Object.values(S)) {
        if (Math.abs(q.v) < 0.001 && Math.abs(q.x - q.g) < 0.001) {
          q.x = q.g;
          q.v = 0;
          continue;
        }
        settling = true;
        const n = Math.max(1, Math.round(dt * 120)),
          h = dt / n;
        for (let i = 0; i < n; i++) {
          q.v += (-q.k * (q.x - q.g) - q.c * q.v) * h;
          q.x += q.v * h;
        }
      }
      const still = reduce.matches;
      if (!still) s += (dt * S.speed.x * path.P) / period;
      const base = still ? path.P * 0.18 + path.P * tailF : s;
      const amp = S.br.x + S.fl.x * 0.6;
      place(comets[0]!, base, amp);
      place(comets[1]!, base + path.P / 2, S.twin.x * amp);
      flash.style.opacity = (S.fl.x * 0.55).toFixed(3);
      return (visible && !document.hidden && !still) || settling;
    },
  };
  const run = () => wake(api);
  const io = new IntersectionObserver((e) => {
    visible = e[0]?.isIntersecting ?? false;
    if (visible) run();
  });
  io.observe(el);

  const onVis = () => {
    if (!document.hidden) run();
  };
  document.addEventListener("visibilitychange", onVis);

  const inert = () =>
    (el instanceof HTMLButtonElement ? el.disabled : false) ||
    el.getAttribute("aria-disabled") === "true";
  const busy = () => el.getAttribute("aria-busy") === "true";
  let hot = false;
  const sync = () => {
    const b = busy(),
      d = inert();
    S.speed.g = d ? 0.35 : b ? 3.4 : hot ? 2.3 : 1;
    S.twin.g = !d && (hot || b) ? 1 : 0;
    S.br.g = d ? 0.18 : hot || b ? 1 : 0.8;
    el.classList.toggle("is-hot", hot && !d && !b);
    run();
  };
  const mo = new MutationObserver((m) => {
    if (m.some((r) => (r.attributeName ?? "").startsWith("data-"))) readAttrs();
    sync();
  });
  mo.observe(el, {
    attributes: true,
    attributeFilter: ["data-period", "data-tail", "aria-busy", "aria-disabled", "disabled"],
  });

  const offs: Array<() => void> = [];
  const on = (type: string, fn: (e: Event) => void, opts?: boolean | AddEventListenerOptions) => {
    el.addEventListener(type, fn, opts);
    offs.push(() => el.removeEventListener(type, fn, opts));
  };
  const aim = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    ring.style.setProperty("--mx", `${e.clientX - r.left}px`);
    ring.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  on("pointerenter", (e) => {
    aim(e as PointerEvent);
    if ((e as PointerEvent).pointerType === "mouse") {
      hot = true;
      sync();
    }
  });
  on("pointermove", (e) => aim(e as PointerEvent), { passive: true });
  on("pointerleave", () => {
    hot = false;
    sync();
  });
  on("focus", () => {
    if (el.matches(":focus-visible")) {
      hot = true;
      sync();
    }
  });
  on("blur", () => {
    hot = false;
    sync();
  });
  const flare = () => {
    if (inert()) return;
    S.fl.g = 0;
    S.fl.x = 1;
    S.fl.v = 0;
    run();
  };
  on("pointerdown", (e) => {
    flare();
    if ((e as PointerEvent).pointerType !== "mouse") {
      hot = true;
      sync();
    }
  });
  on("pointerup", (e) => {
    if ((e as PointerEvent).pointerType !== "mouse")
      setTimeout(() => {
        hot = false;
        sync();
      }, 600);
  });
  on("keydown", (e) => {
    if ((e as KeyboardEvent).key === "Enter" || (e as KeyboardEvent).key === " ") flare();
  });

  readAttrs();
  measure();
  sync();

  return () => {
    live.delete(api);
    ro.disconnect();
    io.disconnect();
    mo.disconnect();
    document.removeEventListener("visibilitychange", onVis);
    offs.forEach((off) => off());
    while (label.firstChild) el.appendChild(label.firstChild);
    glow.remove();
    body.remove();
    ring.remove();
    mounted.delete(el);
  };
}
