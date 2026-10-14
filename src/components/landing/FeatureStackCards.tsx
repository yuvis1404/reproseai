import { useEffect, useRef } from "react";

import { mountStackCards } from "@/lib/vs-stack-cards";

import "./stack-cards.css";

const media = (inner: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(inner)}`;

const linkedinMedia = media(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><rect width="800" height="600" fill="#e9ecf9"/><rect x="100" y="80" width="600" height="450" rx="28" fill="#ffffff" stroke="#d5d0ea" stroke-width="2"/><circle cx="180" cy="170" r="34" fill="#6C3AE8"/><rect x="236" y="146" width="220" height="18" rx="9" fill="#c9c4d9"/><rect x="236" y="176" width="140" height="13" rx="6.5" fill="#ddd9e8"/><rect x="140" y="250" width="520" height="17" rx="8.5" fill="#b9b3cf"/><rect x="140" y="284" width="470" height="17" rx="8.5" fill="#c9c4d9"/><rect x="140" y="318" width="500" height="17" rx="8.5" fill="#c9c4d9"/><rect x="140" y="352" width="300" height="17" rx="8.5" fill="#c9c4d9"/><rect x="140" y="396" width="120" height="36" rx="18" fill="#6C3AE8"/><circle cx="300" cy="414" r="17" fill="none" stroke="#6C3AE8" stroke-width="3"/><rect x="330" y="407" width="90" height="14" rx="7" fill="#ddd9e8"/><rect x="470" y="396" width="190" height="36" rx="18" fill="#BB9AF7" opacity="0.6"/></svg>`,
);

const threadMedia = media(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><rect width="800" height="600" fill="#0d0a1a"/><rect x="110" y="70" width="580" height="470" rx="28" fill="#17122b" stroke="#2b2350" stroke-width="2"/><rect x="150" y="112" width="96" height="34" rx="17" fill="#6C3AE8"/><text x="198" y="135" font-family="Arial" font-size="18" font-weight="700" fill="#f4f2fa" text-anchor="middle">1/8</text><rect x="266" y="124" width="130" height="13" rx="6.5" fill="#4a4166"/><rect x="150" y="184" width="500" height="16" rx="8" fill="#575077"/><rect x="150" y="216" width="470" height="16" rx="8" fill="#575077"/><rect x="150" y="248" width="510" height="16" rx="8" fill="#575077"/><rect x="150" y="294" width="96" height="30" rx="15" fill="none" stroke="#3a3358" stroke-width="2"/><text x="198" y="314" font-family="Arial" font-size="16" font-weight="700" fill="#575077" text-anchor="middle">2/8</text><rect x="150" y="346" width="480" height="16" rx="8" fill="#575077"/><rect x="150" y="378" width="420" height="16" rx="8" fill="#575077"/><rect x="150" y="430" width="170" height="40" rx="20" fill="#BB9AF7" opacity="0.35"/><rect x="340" y="430" width="170" height="40" rx="20" fill="none" stroke="#3a3358" stroke-width="2"/><rect x="530" y="440" width="16" height="20" rx="8" fill="#575077"/></svg>`,
);

const carouselMedia = media(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6C3AE8"/><stop offset="1" stop-color="#BB9AF7"/></linearGradient></defs><rect width="800" height="600" fill="url(#g)"/><rect x="110" y="170" width="300" height="380" rx="24" fill="#ffffff" opacity="0.35" transform="rotate(-7 260 360)"/><rect x="250" y="150" width="300" height="380" rx="24" fill="#ffffff" opacity="0.6" transform="rotate(3 400 340)"/><rect x="392" y="120" width="310" height="380" rx="24" fill="#ffffff"/><rect x="420" y="160" width="254" height="180" rx="14" fill="#e9ecf9"/><rect x="420" y="368" width="200" height="20" rx="10" fill="#b9b3cf"/><rect x="420" y="400" width="160" height="20" rx="10" fill="#c9c4d9"/><rect x="420" y="432" width="120" height="20" rx="10" fill="#c9c4d9"/><circle cx="497" cy="250" r="34" fill="#6C3AE8"/><circle cx="482" cy="238" r="8" fill="#ffffff"/><rect x="478" y="252" width="10" height="18" rx="5" fill="#ffffff"/><rect x="496" y="246" width="10" height="24" rx="5" fill="#ffffff"/><rect x="514" y="256" width="10" height="14" rx="5" fill="#ffffff"/><circle cx="490" cy="498" r="9" fill="#6C3AE8"/><circle cx="522" cy="498" r="9" fill="#ddd9e8"/><circle cx="554" cy="498" r="9" fill="#ddd9e8"/></svg>`,
);

const voiceMedia = media(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><rect width="800" height="600" fill="#eef0fa"/><rect x="70" y="150" width="300" height="200" rx="24" fill="#d8d8e2"/><rect x="100" y="190" width="200" height="14" rx="7" fill="#b6b6c2"/><rect x="100" y="220" width="230" height="14" rx="7" fill="#b6b6c2"/><rect x="100" y="250" width="170" height="14" rx="7" fill="#b6b6c2"/><text x="220" y="390" font-family="Arial" font-size="64" fill="#b6b6c2" text-anchor="middle">x</text><line x1="70" y1="120" x2="370" y2="420" stroke="#e57373" stroke-width="6" stroke-linecap="round" opacity="0.8"/><rect x="430" y="180" width="300" height="240" rx="24" fill="#6C3AE8"/><rect x="458" y="224" width="10" height="52" rx="5" fill="#ffffff" opacity="0.9"/><rect x="476" y="204" width="10" height="92" rx="5" fill="#ffffff"/><rect x="494" y="224" width="10" height="52" rx="5" fill="#ffffff" opacity="0.9"/><rect x="512" y="212" width="10" height="76" rx="5" fill="#ffffff"/><rect x="530" y="236" width="10" height="28" rx="5" fill="#ffffff" opacity="0.8"/><rect x="548" y="218" width="10" height="64" rx="5" fill="#ffffff"/><rect x="566" y="232" width="10" height="36" rx="5" fill="#ffffff" opacity="0.9"/><rect x="584" y="222" width="10" height="56" rx="5" fill="#ffffff"/><rect x="458" y="330" width="214" height="16" rx="8" fill="#ffffff" opacity="0.85"/><rect x="458" y="360" width="160" height="16" rx="8" fill="#ffffff" opacity="0.6"/><path d="M405 300 h30 m0 0 l-12 -12 m12 12 l-12 12" stroke="#6C3AE8" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
);

export function FeatureStackCards() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return mountStackCards(el);
  }, []);

  return (
    <section
      className="vs-stack-cards"
      aria-label="Four ways Reprose multiplies your reach"
      ref={ref}
    >
      <article className="vs-stack-cards-card" aria-label="Feature 1 of 4, LinkedIn Posts">
        <div className="vs-stack-cards-inner">
          <button
            className="vs-stack-cards-tab"
            type="button"
            aria-label="Bring feature 1, LinkedIn Posts, to the top"
          >
            <span>
              <b>01</b>LinkedIn Posts
            </span>
            <span>B2B reach</span>
          </button>
          <div className="vs-stack-cards-grid">
            <div className="vs-stack-cards-media">
              <img
                src={linkedinMedia}
                alt="Stylized illustration of a LinkedIn post with a hook line and engagement"
                draggable="false"
                loading="eager"
              />
            </div>
            <div className="vs-stack-cards-body">
              <div className="vs-stack-cards-top">
                <span className="vs-stack-cards-num">01</span>
                <span className="vs-stack-cards-seal" aria-hidden="true">
                  in
                </span>
              </div>
              <h3 className="vs-stack-cards-title">
                Hook first, <span>then deliver.</span>
              </h3>
              <p className="vs-stack-cards-text">
                Hook-first, short-paragraph posts that drive engagement and grow your professional
                audience.
              </p>
              <div className="vs-stack-cards-meta">
                <span>LinkedIn</span>
                <span>1,200 chars</span>
                <span>2 min read</span>
              </div>
            </div>
          </div>
          <div className="vs-stack-cards-shade" aria-hidden="true"></div>
        </div>
      </article>
      <article className="vs-stack-cards-card" aria-label="Feature 2 of 4, X Threads">
        <div className="vs-stack-cards-inner">
          <button
            className="vs-stack-cards-tab"
            type="button"
            aria-label="Bring feature 2, X Threads, to the top"
          >
            <span>
              <b>02</b>X Threads
            </span>
            <span>Fast follows</span>
          </button>
          <div className="vs-stack-cards-grid">
            <div className="vs-stack-cards-media">
              <img
                src={threadMedia}
                alt="Stylized illustration of a numbered X thread"
                draggable="false"
                loading="eager"
              />
            </div>
            <div className="vs-stack-cards-body">
              <div className="vs-stack-cards-top">
                <span className="vs-stack-cards-num">02</span>
                <span className="vs-stack-cards-seal" aria-hidden="true">
                  X
                </span>
              </div>
              <h3 className="vs-stack-cards-title">
                One idea, <span>eight posts deep.</span>
              </h3>
              <p className="vs-stack-cards-text">
                Numbered tweet threads that build anticipation and drive profile follows — one idea,
                unfolded beat by beat.
              </p>
              <div className="vs-stack-cards-meta">
                <span>X thread</span>
                <span>8 tweets</span>
                <span>Numbered</span>
              </div>
            </div>
          </div>
          <div className="vs-stack-cards-shade" aria-hidden="true"></div>
        </div>
      </article>
      <article className="vs-stack-cards-card" aria-label="Feature 3 of 4, Instagram Carousels">
        <div className="vs-stack-cards-inner">
          <button
            className="vs-stack-cards-tab"
            type="button"
            aria-label="Bring feature 3, Instagram Carousels, to the top"
          >
            <span>
              <b>03</b>Instagram
            </span>
            <span>Saves & shares</span>
          </button>
          <div className="vs-stack-cards-grid">
            <div className="vs-stack-cards-media">
              <img
                src={carouselMedia}
                alt="Stylized illustration of an Instagram carousel with three slides"
                draggable="false"
                loading="eager"
              />
            </div>
            <div className="vs-stack-cards-body">
              <div className="vs-stack-cards-top">
                <span className="vs-stack-cards-num">03</span>
                <span className="vs-stack-cards-seal" aria-hidden="true">
                  IG
                </span>
              </div>
              <h3 className="vs-stack-cards-title">
                Ten slides, <span>one story.</span>
              </h3>
              <p className="vs-stack-cards-text">
                Slide-by-slide carousel scripts ready to design in Canva or Unfold.
              </p>
              <div className="vs-stack-cards-meta">
                <span>Carousel</span>
                <span>10 slides</span>
                <span>Canva-ready</span>
              </div>
            </div>
          </div>
          <div className="vs-stack-cards-shade" aria-hidden="true"></div>
        </div>
      </article>
      <article className="vs-stack-cards-card" aria-label="Feature 4 of 4, Voice Training">
        <div className="vs-stack-cards-inner">
          <button
            className="vs-stack-cards-tab"
            type="button"
            aria-label="Bring feature 4, Voice Training, to the top"
          >
            <span>
              <b>04</b>Voice Training
            </span>
            <span>Sounds like you</span>
          </button>
          <div className="vs-stack-cards-grid">
            <div className="vs-stack-cards-media">
              <img
                src={voiceMedia}
                alt="Illustration contrasting a flat generic AI post with a vivid post in your own voice"
                draggable="false"
                loading="eager"
              />
            </div>
            <div className="vs-stack-cards-body">
              <div className="vs-stack-cards-top">
                <span className="vs-stack-cards-num">04</span>
                <span className="vs-stack-cards-seal" aria-hidden="true">
                  ✦
                </span>
              </div>
              <h3 className="vs-stack-cards-title">
                Written by you, <span>everywhere.</span>
              </h3>
              <p className="vs-stack-cards-text">
                Reprose learns from your past writing — your tone, vocabulary, sentence style, and
                personality — so every output feels like YOU wrote it.
              </p>
              <div className="vs-stack-cards-meta">
                <span>Voice model</span>
                <span>Your archive</span>
                <span>Tone matched</span>
              </div>
            </div>
          </div>
          <div className="vs-stack-cards-shade" aria-hidden="true"></div>
        </div>
      </article>
    </section>
  );
}
