# Vaultra

The Vaultra marketing site, rebuilt as a Next.js 16 App Router app. One static
page, five images, two lead forms wired to [Web3Forms](https://web3forms.com).

## Getting started

```bash
npm install
cp .env.example .env.local   # then paste your Web3Forms key
npm run dev                  # http://localhost:3000
```

## Wiring up the forms (required before launch)

Both forms — the sticky "Book a 20-minute call" dialog and the contact section
at the bottom of the page — post to Web3Forms and land in your inbox.

1. Go to <https://web3forms.com>, enter the address that should receive
   enquiries, and they email you an access key straight away. No account,
   no dashboard, no backend.
2. Put the key in `.env.local`:

   ```
   NEXT_PUBLIC_WEB3FORMS_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```

3. On Vercel, add the same variable under **Settings → Environment Variables**
   for Production, Preview and Development, then redeploy.

Until a key is set, submitting either form shows an inline "this form isn't
connected yet" message instead of failing silently.

Each submission arrives as an email containing name, company, phone/WhatsApp,
the description of the repetitive work, the budget band, and which form it came
from. A hidden `botcheck` honeypot field drops bot submissions.

Note that Web3Forms only accepts requests from the browser, so the key is
public by design — it can only ever deliver mail to the address you registered.

## Deploying to Vercel

```bash
npx vercel        # preview
npx vercel --prod # production
```

Or push to GitHub and import the repo at <https://vercel.com/new>. Vercel
detects Next.js with no configuration. Set `NEXT_PUBLIC_WEB3FORMS_KEY` and
`NEXT_PUBLIC_SITE_URL` in the project's environment variables before the first
production deploy — `NEXT_PUBLIC_SITE_URL` feeds the canonical URL, Open Graph
tags, `robots.txt` and `sitemap.xml`.

## Layout

```
app/
  layout.tsx      fonts, metadata, JSON-LD
  page.tsx        section composition
  globals.css     every style in the site
  icon.svg        favicon
  robots.ts       robots.txt
  sitemap.ts      sitemap.xml
components/
  BookingProvider.tsx   modal + mobile-menu state, Escape handling, scroll lock
  BookCallButton.tsx    the CTA, in its six sizes
  Header.tsx            fixed nav and the full-screen mobile menu
  BookingModal.tsx      the booking dialog
  LeadForm.tsx          the form both entry points share, and the Web3Forms POST
  MobileCtaBar.tsx      sticky bottom bar under 860px
  Reveal.tsx            fade-and-rise on scroll
  Logo.tsx
  sections/             Hero, Problem, Build, Process, Answers, Contact, Footer
lib/
  siteConfig.ts   copy-level constants and the three layout switches
public/images/    the five photographs
```

## Responsive behaviour

Fluid by construction — `clamp()` type, `auto-fit` grids and wrapping flex rows
carry the layout from 320px to ultrawide with one breakpoint at **860px**,
where the nav becomes a full-screen menu and the sticky CTA bar appears.

Verified with no horizontal overflow at 320, 360, 375, 390, 414, 430, 600, 740,
768, 834, 860, 1024, 1280, 1440 and 1920 wide, plus a 360px-tall landscape
phone.

Specific accommodations, in `app/globals.css` under "Responsive corrections":

- Auto-fit grid tracks are `minmax(min(292px, 100%), 1fr)`. A bare
  `minmax(292px, 1fr)` keeps a 292px track even in a 280px container, which
  pushed the page sideways on a 320px phone.
- Form fields render at 16px below 860px. iOS Safari zooms the whole page when
  a focused field is smaller than that, and the visitor cannot undo it.
- The hero and section CTAs become full-width blocks below 520px; at their
  desktop size they are about 280px wide and do not fit a 320px screen.
- The full-screen menu scrolls, and its type shrinks under 560px of height —
  on a landscape phone its CTA was otherwise pushed off the bottom with no way
  to reach it.
- `env(safe-area-inset-bottom)` on the sticky bar, the menu and the booking
  sheet, so nothing hides under an iPhone home indicator.
- The booking sheet is capped in `dvh`, not `vh`, so mobile browser chrome
  does not clip it.
- Hover effects are suppressed under `@media (hover: none)`, where they stick
  after a tap.

## One call to action at a time

The page offers the same "Book a 20-minute call" in several places. The sticky
mobile bar watches every other CTA on the page (`[data-cta]`: the hero button,
the two section buttons, the contact form's own submit) through an
IntersectionObserver and hides itself whenever one is on screen, so the same
button is never shown twice at once.

## Switches

`lib/siteConfig.ts` carries the three knobs that were editor props on the
original design:

| Constant | Default | Effect |
| --- | --- | --- |
| `bookingCta` | `"modal"` | `"contact"` makes every CTA scroll to the contact form instead of opening the dialog |
| `mobileCtaBar` | `true` | The sticky bottom bar on phones |
| `showProcessImage` | `true` | The brass-rods photograph in "How we work" |
