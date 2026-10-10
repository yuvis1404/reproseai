import { useState } from "react";

import { cn } from "@/lib/utils";

import { Reveal } from "./Reveal";
import { RollText } from "./RollText";

const faqs = [
  {
    question: "Does the output really sound like me?",
    answer:
      "Yes — that's the whole point. Reprose learns from writing you already published: your tone, vocabulary, sentence rhythm, and personality. Every LinkedIn post, thread, and carousel reads like you wrote it, not like a chatbot.",
  },
  {
    question: "Which platforms can I repurpose to?",
    answer:
      "LinkedIn posts, X/Twitter threads, Instagram carousel scripts, and standalone hooks — all generated from a single newsletter or blog post, each formatted the way that platform rewards.",
  },
  {
    question: "How long does a repurpose take?",
    answer:
      "About 60 seconds from paste to post-ready. You paste your content once, hit Reprose It, and every output is ready to copy in under a minute.",
  },
  {
    question: "What can I paste in?",
    answer:
      "Any newsletter or blog post, from 100 to 10,000 words. Substack, Beehiiv, Ghost, Medium, WordPress — if you can copy the text, Reprose can repurpose it.",
  },
  {
    question: "Do I need a credit card to start?",
    answer:
      "No. The Free plan gives you 3 repurposes per month with all output types included. Upgrade to Creator or Pro only when you're ready for voice training and higher volume.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes — cancel in one click from your account, no emails or phone calls needed. You keep access until the end of your billing period.",
  },
];

function FaqItem({
  question,
  answer,
  open,
  onToggle,
  index,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <li>
      <h3 className="m-0">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`faq-panel-${index}`}
          id={`faq-button-${index}`}
          onClick={onToggle}
          className="flex min-h-12 w-full items-start justify-between gap-3 px-4 py-4 text-left outline-none md:gap-6 md:px-8 md:py-6"
        >
          <span className="text-[17px] font-semibold text-ink md:text-[19px]">{question}</span>
          <span
            aria-hidden="true"
            className={cn(
              "mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-brand-tint text-brand-deep will-change-transform transition-transform duration-300 ease-smooth md:mt-2",
              open && "rotate-45",
            )}
          >
            <svg
              viewBox="0 0 12 12"
              className="size-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 1v10M1 6h10" />
            </svg>
          </span>
        </button>
      </h3>
      <div
        id={`faq-panel-${index}`}
        role="region"
        aria-labelledby={`faq-button-${index}`}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-smooth",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <p className="px-4 pb-5 text-[15px] leading-7 text-gray-muted md:px-8 md:pb-7 md:text-[16px] md:leading-8">
            {answer}
          </p>
        </div>
      </div>
    </li>
  );
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="scroll-mt-24 bg-paper px-5 py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="min-w-0 lg:col-span-4">
          <div className="flex flex-col items-start gap-4 lg:sticky lg:top-28 lg:gap-8">
            <Reveal>
              <h2 className="text-[32px] font-bold leading-tight tracking-[-1px] text-ink md:text-[48px] md:leading-[56px]">
                FAQs
              </h2>
              <p className="mt-4 max-w-sm text-[17px] leading-8 text-gray-muted">
                Everything you need to know about turning one post into everywhere.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <a
                href="mailto:hello@reprose.ai"
                className="group inline-flex h-12 items-center justify-center rounded-full bg-brand px-7 text-[15px] font-bold text-paper transition-all duration-200 hover:bg-brand-deep hover:shadow-[0_8px_24px_color-mix(in_oklab,var(--color-brand)_45%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <RollText text="More questions →" />
              </a>
            </Reveal>
          </div>
        </div>

        <Reveal delay={150} className="min-w-0 lg:col-span-8">
          <ul className="flex flex-col gap-4">
            {faqs.map((faq, i) => (
              <li
                key={faq.question}
                className={cn(
                  "rounded-2xl border border-brand-tint bg-gradient-to-b from-paper to-brand-tint/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7)] backdrop-blur-xl backdrop-saturate-150 transition-[border-color,box-shadow] duration-300 ease-smooth hover:border-brand/40 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.95),0_8px_32px_color-mix(in_oklab,var(--color-brand)_8%,transparent)] md:rounded-3xl",
                )}
              >
                <FaqItem
                  index={i}
                  question={faq.question}
                  answer={faq.answer}
                  open={openIndex === i}
                  onToggle={() => setOpenIndex((v) => (v === i ? -1 : i))}
                />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
