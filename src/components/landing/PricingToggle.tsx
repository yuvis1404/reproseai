import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import { mountPricingToggle } from "@/lib/vs-pricing-toggle";

import "./pricing-toggle.css";

function Check() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3.5 8.5l3 3 6-7" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8h10" />
      <path d="M9 4l4 4-4 4" />
    </svg>
  );
}

export function PricingToggle() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return mountPricingToggle(el);
  }, []);

  return (
    <div className="vs-pricing-toggle" data-period="monthly" data-highlight="2" ref={ref}>
      <div className="vs-pricing-toggle-switch" role="radiogroup" aria-label="Billing period">
        <span className="vs-pricing-toggle-thumb" aria-hidden="true"></span>
        <button className="vs-pricing-toggle-opt" type="button" role="radio" data-period="monthly">
          Monthly
        </button>
        <button className="vs-pricing-toggle-opt" type="button" role="radio" data-period="yearly">
          Yearly <span className="vs-pricing-toggle-save">&minus;20%</span>
        </button>
      </div>
      <div className="vs-pricing-toggle-grid">
        <article className="vs-pricing-toggle-card">
          <span className="vs-pricing-toggle-glow" aria-hidden="true"></span>
          <div className="vs-pricing-toggle-top">
            <h3 className="vs-pricing-toggle-name">Free</h3>
          </div>
          <p className="vs-pricing-toggle-for">
            To try Reprose and see your posts land everywhere.
          </p>
          <div className="vs-pricing-toggle-amount">
            <span
              className="vs-pricing-toggle-price"
              data-currency="$"
              data-monthly="0"
              data-yearly="0"
              dangerouslySetInnerHTML={{ __html: "$0" }}
            />
            <span className="vs-pricing-toggle-per">
              <span>per month</span>
            </span>
          </div>
          <p className="vs-pricing-toggle-note">
            <span data-for="monthly">
              <i>No credit card required</i>
            </span>
            <span data-for="yearly">
              <i>Free forever</i>
            </span>
          </p>
          <Link
            to="/signup"
            className="vs-pricing-toggle-cta"
            aria-label="Start free on the Free plan"
          >
            Start Free
            <Arrow />
          </Link>
          <ul className="vs-pricing-toggle-list">
            <li>
              <Check />
              <span>3 repurposes per month</span>
            </li>
            <li>
              <Check />
              <span>All 4 output types</span>
            </li>
            <li>
              <Check />
              <span>Basic content history</span>
            </li>
          </ul>
        </article>
        <article className="vs-pricing-toggle-card">
          <span className="vs-pricing-toggle-glow" aria-hidden="true"></span>
          <div className="vs-pricing-toggle-top">
            <h3 className="vs-pricing-toggle-name">Creator</h3>
            <span className="vs-pricing-toggle-badge">Most popular</span>
          </div>
          <p className="vs-pricing-toggle-for">
            For serious newsletter writers ready to grow their reach.
          </p>
          <div className="vs-pricing-toggle-amount">
            <span
              className="vs-pricing-toggle-price"
              data-currency="$"
              data-monthly="19"
              data-yearly="15"
              dangerouslySetInnerHTML={{ __html: "$19" }}
            />
            <span className="vs-pricing-toggle-per">
              <span>per month</span>
            </span>
          </div>
          <p className="vs-pricing-toggle-note">
            <span data-for="monthly">
              <i>Billed monthly, cancel any time</i>
            </span>
            <span data-for="yearly">
              <b className="vs-pricing-toggle-off">Save $48</b>
              <i>$180 billed yearly</i>
            </span>
          </p>
          <Link
            to="/signup"
            className="vs-pricing-toggle-cta"
            aria-label="Start creating on the Creator plan"
          >
            Start Creating
            <Arrow />
          </Link>
          <ul className="vs-pricing-toggle-list">
            <li className="is-lead">
              <Check />
              <span>Everything in Free</span>
            </li>
            <li>
              <Check />
              <span>30 repurposes per month</span>
            </li>
            <li>
              <Check />
              <span>Voice training (sounds like you)</span>
            </li>
            <li>
              <Check />
              <span>Full history + priority AI</span>
            </li>
          </ul>
        </article>
        <article className="vs-pricing-toggle-card">
          <span className="vs-pricing-toggle-glow" aria-hidden="true"></span>
          <div className="vs-pricing-toggle-top">
            <h3 className="vs-pricing-toggle-name">Pro</h3>
          </div>
          <p className="vs-pricing-toggle-for">For high-volume writers and small teams.</p>
          <div className="vs-pricing-toggle-amount">
            <span
              className="vs-pricing-toggle-price"
              data-currency="$"
              data-monthly="39"
              data-yearly="31"
              dangerouslySetInnerHTML={{ __html: "$39" }}
            />
            <span className="vs-pricing-toggle-per">
              <span>per month</span>
            </span>
          </div>
          <p className="vs-pricing-toggle-note">
            <span data-for="monthly">
              <i>Billed monthly, cancel any time</i>
            </span>
            <span data-for="yearly">
              <b className="vs-pricing-toggle-off">Save $96</b>
              <i>$372 billed yearly</i>
            </span>
          </p>
          <Link
            to="/signup"
            search={{ plan: "pro" }}
            className="vs-pricing-toggle-cta"
            aria-label="Go Pro with Reprose"
          >
            Go Pro
            <Arrow />
          </Link>
          <ul className="vs-pricing-toggle-list">
            <li className="is-lead">
              <Check />
              <span>Everything in Creator</span>
            </li>
            <li>
              <Check />
              <span>Unlimited repurposes</span>
            </li>
            <li>
              <Check />
              <span>Fastest AI generation</span>
            </li>
            <li>
              <Check />
              <span>Early access + priority support</span>
            </li>
          </ul>
        </article>
      </div>
    </div>
  );
}
