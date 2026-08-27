# Vaultra

The Vaultra marketing site, built as a Next.js 16 App Router app from the
design canvas in *Vaultra Landing.dc.html*. One static page, seven
photographs, one lead form wired to [Web3Forms](https://web3forms.com).

## Getting started

```bash
npm install
cp .env.example .env.local   # then paste your Web3Forms key
npm run dev                  # http://localhost:3000
```

## Wiring up the form (required before launch)

The booking form at the bottom of the page posts to Web3Forms and lands in
your inbox.

1. Go to <https://web3forms.com>, enter the address that should receive
   enquiries, and they email you an access key straight away. No account,
   no dashboard, no backend.
2. Put the key in `.env.local`:

   ```
   NEXT_PUBLIC_WEB3FORMS_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```

3. On Vercel, add the same variable under **Settings → Environment Variables**
   for Production, Preview and Development, then redeploy.

Until a key is set, submitting shows an inline "this form isn't connected yet"
message instead of failing silently.

Each submission arrives as an email containing the name, WhatsApp number, the
description of the repetitive work, the optional company and budget, and the
day and time the visitor picked. A hidden `botcheck` honeypot field drops bot
submissions.

Note that Web3Forms only accepts requests from the browser, so the key is
public by design — it can only ever deliver mail to the address you registered.

## Before launch — the placeholders

The design ships with three deliberate placeholders:

| Where | What to replace |
| --- | --- |
| `lib/siteConfig.ts` → `whatsapp` | `91XXXXXXXXXX` — the real WhatsApp number, digits only, country code first. It feeds the "Message us on WhatsApp" link and the mobile bar's WA button. |
| `lib/siteConfig.ts` → `callers` | The two names read back in the booking confirmation. |
| `components/sections/Proof.tsx` | The three case studies and the pull quote are sample entries, labelled as such on the page. Swap in real numbers and delete `.proof__disclaimer`. |

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
  Header.tsx      sticky header
  Cta.tsx         the call to action, in its five sizes
  Logo.tsx        the three-bar mark
  Reveal.tsx      fade-and-rise on scroll
  StickyBars.tsx  the dismissible desktop bar and the mobile bar
  sections/
    Hero.tsx        the headline, and the invoice → voucher pair
    Calculator.tsx  01 · the hours-and-rupees calculator
    Build.tsx       02 · the six things we build
    Proof.tsx       03 · case studies and the pull quote
    Process.tsx     04 · the three steps
    Promise.tsx     05 · if it doesn't work
    Answers.tsx     06 · the FAQ accordion
    Booking.tsx     07 · day picker, time picker, form, confirmation
    Footer.tsx
lib/
  siteConfig.ts   copy-level constants and the placeholders above
public/images/    the seven photographs, plus the Open Graph card
```

## The interactive parts

**The calculator** (`01`) starts with two tasks ticked and three people, at
₹400 an hour. Weekly hours become monthly at 4.33 weeks a month; the annual
figure is that, times twelve, times the rate, printed in thousands, lakh or
crore as it grows.

**The booking picker** (`07`) offers the next fourteen days and half-hour slots
from 9:00 am to 8:00 pm IST. The dates come from the visitor's own clock, so
they are built after mount — a server-rendered fortnight could be a day out in
another timezone. Picking a different day clears the chosen time.

**The FAQ** keeps one answer open at a time, the first by default.

**The bars.** Which one shows is decided in CSS at 768px, so neither can flash
on first paint. The desktop bar appears a screen or so down, hides inside the
booking section — where the same call to action already is — and stays hidden
once dismissed.

## Responsive behaviour

Fluid by construction — `clamp()` type, `auto-fit` grids whose tracks are
`minmax(min(100%, X), 1fr)`, and wrapping flex rows carry the layout from 320px
to ultrawide.

Verified with no horizontal overflow at 320, 390 and 768 wide, and at 1440.

The corrections that fluid alone could not cover live at the end of
`app/globals.css`:

- **768px** — the mobile bar replaces the desktop one, and the footer gains
  clearance for it.
- **640px** — the header drops "Mumbai" and the pill's "20 MIN" chip rather
  than push the wordmark off the left edge.
- **520px** — the section CTAs go full width. At their design size they are
  about 290px, which does not fit a 320px screen once the gutters are out.
- **560px** — the two hero documents stop overlapping; there is no longer the
  width for the offset.
- **860px** — the calculator's two numeric fields render at 16px. iOS Safari
  zooms the page when a focused field is smaller, and the visitor cannot undo
  it. Every other field is already 17px.
- **420px** — the before → after row stacks so the numbers keep their size.
- `env(safe-area-inset-bottom)` on both bars, so nothing hides under an iPhone
  home indicator.
- Hover effects are suppressed under `@media (hover: none)`, where they stick
  after a tap.
- `prefers-reduced-motion` reveals everything outright and stops the two hero
  cards animating in.
