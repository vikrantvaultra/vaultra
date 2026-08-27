# Vaultra

The Vaultra marketing site, built as a Next.js 16 App Router app. One static
page laid out as a vastu ledger — an ivory folio ruled in gold, worked in deep
prosperity green, with saffron reserved for the one thing the page asks you to
do. Seven photographs filed as numbered plates, one lead form wired to
[Web3Forms](https://web3forms.com).

## Getting started

```bash
npm install
cp .env.example .env.local   # then paste your Web3Forms key
npm run dev                  # http://localhost:3000
```

## The design

The palette is placed rather than chosen, and the section order follows it:

| Token | Colour | Stands for | Where it is allowed |
| --- | --- | --- | --- |
| `--base` / `--sheet` | ivory | the uncluttered ground | page and card backgrounds |
| `--ink` | deep green | Budh · commerce | all body text and headings |
| `--gold` | brass | wealth | the margin rule, folio numbers, the guarantee |
| `--fire` | saffron | Agni · action | **booking only** — nothing else is ever this colour |
| `--leaf` | growth green | hours recovered | the credit side, stamps, ticks |

Each section carries a folio number and the direction it sits in — north for
Kubera and wealth (`01 · the cost`), east for growth (`02 · what we build`),
south-west for stability (`03 · proof`), west for gains (`04 · how it works`),
north-east for clarity (`00 · hero`, `05 · answers`), south-east for Agni and
action (`06 · book the call`).

A single gold rule runs the full height of the page at the left margin, the way
a ledger's margin line does. It is `body::before`, fixed, and never scrolls.

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

Each submission arrives as an email containing the name, company, phone, the
description of the repetitive work, the optional budget, and the day and time
the visitor picked. A hidden `website` honeypot field drops bot submissions.

Note that Web3Forms only accepts requests from the browser, so the key is
public by design — it can only ever deliver mail to the address you registered.

## Before launch — the placeholders

| Where | What to replace |
| --- | --- |
| `lib/siteConfig.ts` → `whatsapp` | `91XXXXXXXXXX` — the real WhatsApp number, digits only, country code first. It feeds every "Message us on WhatsApp" link. |
| `lib/siteConfig.ts` → `callers` | Who is named in the booking confirmation. |
| `lib/siteConfig.ts` → `capacity` | The month and the number of build slots left, shown in the header pill, the form and the floating bar. **This is meant to move** — a scarcity figure that never changes stops being believed. |
| `lib/siteConfig.ts` → `assumedBuildCost` | The midpoint build price the calculator's payback line is worked out against. |
| `components/sections/Proof.tsx` | The three case studies and the pull quote are sample entries, labelled as such on the page. Swap in real numbers and delete `.proof__sample`. |

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
  Header.tsx      sticky header, nav, capacity pill, the ask
  Cta.tsx         the saffron button
  Folio.tsx       the folio number / label / direction section head
  Logo.tsx        the three-bar mark
  Plate.tsx       a photograph, filed as a numbered plate
  Slots.tsx       the capacity pill
  Stamp.tsx       a rubber stamp, struck four degrees off true
  Reveal.tsx      fade-and-rise on scroll, and the stamp strike
  FloatCta.tsx    the floating ask, a full-width bar on phones
  sections/
    Hero.tsx        00 · the headline, and the invoice → voucher demo
    Hours.tsx       01 · the four pains, and the hours-and-rupees calculator
    Build.tsx       02 · the six jobs, entered as a ledger
    Proof.tsx       03 · case studies, the pull quote, two plates
    Process.tsx     04 · three steps, three promises, the guarantee
    Answers.tsx     05 · the FAQ accordion
    Booking.tsx     06 · the form, the day and time picker, the confirmation
    Footer.tsx
lib/
  siteConfig.ts   copy-level constants and the placeholders above
public/images/    the seven photographs, plus the Open Graph card
```

## The interactive parts

**The calculator** (`01`) starts with the first two tasks ticked, one person on
each, at ₹350 an hour. Weekly hours become monthly at 52 weeks over 12; the
annual figure is weekly hours × 52 × the rate, printed in thousands, lakh or
crore as it grows. The payback line divides `assumedBuildCost` by the monthly
saving and rounds up, and the button underneath names the number it would
recover. Nudging a count up on an unticked task ticks it, so the figure and the
row always agree.

**The booking picker** (`06`) offers the next fourteen days and half-hour slots
from 9:00 am to 8:00 pm IST. The dates come from the visitor's own clock, so
they are built after mount — a server-rendered fortnight could be a day out in
another timezone and would not survive rehydration. Picking a different day
clears the chosen time. Submitting with a required field empty marks the field,
focuses the first one and says what is missing, without a network round trip.

**The FAQ** (`05`) keeps one answer open at a time, the first by default.

**The floating ask** appears a screen or so down and hides again inside the
booking section, where the same ask already is. Below 640px it becomes the
full-width bar at the foot of the screen; that switch is made in CSS, so it
cannot flash the wrong shape on first paint.

**The stamps** are held at opacity zero and struck when they scroll into view.
The confirmation's "Received" stamp is struck on render instead — it answers
something the visitor just did, so it never scrolls in.

## Responsive behaviour

Fluid by construction — `clamp()` type, `clamp()` gutters, and grids whose
tracks are `minmax(0, 1fr)` so a track can never inflate to its content's
minimum and push the page sideways.

Verified with no horizontal overflow at 320, 360, 390, 420, 520, 640, 768,
900, 1024, 1200 and 1440 wide.

The corrections that fluid alone could not cover live at the end of
`app/globals.css`, largest first:

- **1320px / 960px** — the header sheds the capacity pill, then the nav, rather
  than crush the wordmark. The pill also reads in short form in the bar (`Sep ·
  1 slot left`) — the full sentence does not fit beside five links and the ask.
- **940px / 900px / 880px / 860px / 760px** — the hero, booking, build head,
  calculator and steps, and the guarantee each go to one column.
- **860px** — the rate field and the people counter render at 16px. iOS Safari
  zooms the page when a focused field is smaller and the visitor cannot undo
  it; every other field is already above that.
- **680px** — the ledger drops its number column and narrows the credit column.
- **640px** — the margin rule moves in to 12px, the pain rows stack, and the
  floating ask becomes the bottom bar. Clearance for that bar goes on the last
  section it can cover, not on the body, which would leave a dead strip under
  the footer for the whole visit.
- **560px** — the calculator's task label takes its own row so it stops
  wrapping to four lines beside the stepper.
- **520px** — the hero and band CTAs go full width.
- **420px** — the before → after row stacks and its arrow turns to point down,
  and the header's ask gives up its arrow and some padding rather than its
  words, so it still fits at 320 beside the wordmark.
- `env(safe-area-inset-bottom)` on the bottom bar, so nothing hides under an
  iPhone home indicator.
- Hover effects are suppressed under `@media (hover: none)`, where they stick
  after a tap.
- `prefers-reduced-motion` reveals everything outright and stops the stamps,
  the button sheen and the capacity dot animating.
