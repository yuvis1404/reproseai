import { createFileRoute } from "@tanstack/react-router";

import { Features } from "@/components/landing/Features";
import { FinalCta } from "@/components/landing/FinalCta";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Nav } from "@/components/landing/Nav";
import { PlatformBar } from "@/components/landing/PlatformBar";
import { Pricing } from "@/components/landing/Pricing";
import { LandingScrollObserver } from "@/components/landing/Reveal";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { Testimonials } from "@/components/landing/Testimonials";

const title = "Reprose — Write once. Reach everywhere.";
const description =
  "Turn your newsletter or blog post into LinkedIn posts, X threads, and Instagram carousels in 60 seconds. AI that writes in YOUR voice.";
const url = "https://reproseai.lovable.app/";
const image = "https://reproseai.lovable.app/og-reprose.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Reprose",
          applicationCategory: "BusinessApplication",
          description,
          offers: [
            { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD" },
            { "@type": "Offer", name: "Creator", price: "19", priceCurrency: "USD" },
            { "@type": "Offer", name: "Pro", price: "39", priceCurrency: "USD" },
          ],
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="font-display min-h-screen bg-ink antialiased">
      <LandingScrollObserver />
      <Nav />
      <main>
        <Hero />
        <PlatformBar />
        <HowItWorks />
        <Features />
        <Pricing />
        <Testimonials />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}
