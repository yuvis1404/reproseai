# Reprose AI — SaaS Landing Page

Build the full landing page to the supplied brand spec, on the home route.

## Design system

Add the Reprose palette and Inter typography as design tokens in `src/styles.css` (oklch values for #6C3AE8, #4A1DB0, #9B6FFF, #EDE9FF, #0D0A1A, #1A1035, #FAFAF8, #6B7280, lavender #C4B5FD), plus reusable gradient, glow-shadow, radius (16px cards / 12px buttons), float, shimmer, typing-cursor and fade-in-on-scroll animations. Inter loads via a `<link>` in the root route head. No hardcoded color classes in components — every color comes from a token.

## Sections (in order, on `/`)

1. **Sticky nav** — transparent, then dark frosted glass with a purple hairline border on scroll; quill logo + "Reprose"; Sign In (ghost) and Start Free (solid purple); hamburger menu on mobile.
2. **Hero** — near-black background, radial purple bloom behind the headline, faint purple grid/dot overlay; shimmering pill badge; "Write once." in white plus "Reach everywhere." in violet gradient text; lavender subheadline; gradient primary CTA and ghost secondary CTA; avatar-row social proof.
3. **Hero mockup** — pure CSS floating product card (6s up/down loop) with a paste-newsletter input panel (textarea, output-type pill badges, "Reprose It" button) and an output panel with LinkedIn / X Thread / Instagram / Hook tabs, sample LinkedIn output and a Copy button.
4. **Platform bar** — "Trusted by writers publishing on" plus Substack, Beehiiv, Ghost, Medium, WordPress at 50% opacity, full opacity on hover.
5. **How it works** — white section, purple eyebrow label, three numbered step cards with decorative gradient numerals, icon circles, descriptions and timing pills, dashed arrows between cards on desktop.
6. **Features** — dark gradient section with star-dot pattern; two-column glass cards for LinkedIn Posts, X/Twitter Threads and Instagram Carousels (each with a small animated preview snippet), plus a full-width Voice Training key-differentiator card with gradient accent border, purple glow and a Generic AI vs Your Voice comparison.
7. **Pricing** — off-white section, Monthly/Annual toggle (Annual shows Save 20% and swaps prices), Free / Creator (elevated gradient purple, MOST POPULAR) / Pro cards with feature lists, then a trust-badges row.
8. **Testimonials** — dark gradient, three glass cards with stars, quotes, initial-avatar author rows, and the representative-examples disclaimer.
9. **Final CTA banner** — purple gradient with grain texture and decorative rings, headline, subtext, white CTA.
10. **Footer** — four link columns, logo, tagline, social icons, and a bottom bar with copyright.

## Routing

CTAs need real destinations, so this also adds minimal `/signup` (reads a `plan` query param) and `/login` placeholder pages styled in the same dark brand theme. "See How It Works" smooth-scrolls to `#how-it-works`.

## Technical notes

- Each section is its own component under `src/components/landing/`, composed in `src/routes/index.tsx` (replacing the placeholder). One `<main>` wrapper.
- Scroll reveal via a small Intersection Observer hook; nav blur via a scroll listener. All visuals are CSS only — no images, canvas or WebGL.
- Responsive: single-column grids under 768px, hero headline drops to 48px, Creator card not scaled up on mobile.
- Accessibility: WCAG AA contrast pairs per the spec, aria-labels on icon buttons, visible focus rings, semantic headings with a single H1.
- SEO: unique `head()` on `/` with Reprose-specific title, description and og/twitter tags.