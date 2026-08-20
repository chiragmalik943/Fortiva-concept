# Fortiva — Landing Page Recreation

A pixel-fidelity recreation of the supplied Fortiva landing page design, built with React, Vite, TypeScript, Tailwind, GSAP/ScrollTrigger, Lenis, SplitType and Framer Motion.

## Run it

```bash
npm install
npm run dev
```

Then open the printed `localhost` URL. For a production build:

```bash
npm run build
npm run preview
```

Requires Node 18+.

## What's here

```
src/
├── components/       one folder per section, matching the brief's structure
├── config/pages.ts     which routes are live — the single source of truth
├── content/site.ts    nav IA + contact details + availability, in one place
├── hooks/             useLenis, useSplitReveal, useScrollReveal — shared animation logic
├── animations/        gsap.ts — single place ScrollTrigger gets registered
├── assets/images.ts    every image filename in one place
└── styles/index.css    Tailwind + Lenis required CSS + the two ambient gradients
```

## Switching pages on and off

`src/config/pages.ts` is the single source of truth for which routes this
deployment serves. Every route in the IA is listed there with an `enabled` flag,
and `App.tsx` builds its route table from that list at module load — a page is
reachable if and only if the config says so. Nothing else gets a vote.

```ts
plansEmployers: { enabled: true,  route: '/plans/employers' },
careers:        { enabled: false, route: '/careers' },
```

Taking a page down, or putting it back up, is that one word. No component,
import or route table is touched and the page's own file stays where it is, so
the round trip is symmetrical.

What `enabled: false` does:

- The page component is never mounted. The visitor gets `ComingSoon` instead —
  which page a disabled route falls back to is `disabledFallback` at the top of
  the config, and flipping it to `'not-found'` makes a switched-off route
  indistinguishable from a 404.
- **Direct URL access is covered.** GitHub Pages serves the same bundle for a
  deep link as for an in-site click (`scripts/spa-fallback.mjs`), and that bundle
  resolves every route through the config, so there is no path into a disabled
  page's component — typing the URL, following an old link and clicking through
  the nav all land in the same place.
- **Links stay visible.** The nav and footer keep linking switched-off pages, by
  design: the IA stays whole and the link lands on the fallback. To hide them
  instead, filter `navigation` and `footerNav` in `content/site.ts` through
  `isRouteEnabled` from the config — that helper is already exported for it, and
  those two lists plus a handful of hard-coded CTA hrefs are where every internal
  link in the site comes from.

A URL the config has never heard of is a different case, and gets
`pages/NotFound.tsx` — a real 404 rather than a "coming soon" that promises a
page nobody is building. On the Pages deploy those arrive under an HTTP 404
status too, since `404.html` is what served them.

The `enabled: true` set currently matches, exactly, the pages that have a
component in `src/pages`. Routes that are switched on but not built yet fall back
to `ComingSoon` the same way they always did, so enabling a route early is safe.

## Where the copy comes from

All page copy is from the client's `FTVA_Web Copy.odt`. The doc's own "Home"
section only fills about a third of the page, so the sections below the hero
carry condensed copy promoted from *About*, *Plans* and *For Members → FAQs* —
which is what a homepage should be doing anyway. Nothing on the page is invented
marketing copy; anything the doc doesn't supply is marked `PLACEHOLDER` or
`TODO(client)` in the source rather than filled in.

`src/content/site.ts` is the single place to fix the outstanding gaps — the six
`[Insert …]` phone numbers and email addresses ship exactly as the copy doc
writes them, so they're impossible to miss in review. `Footer.tsx` detects them
and renders plain text instead of a broken `tel:`/`mailto:` link, so real values
become live links with no further edit.

## Design tokens

Pulled directly by sampling the reference screenshot rather than eyeballing:

- Navy `#11284B` · Cream `#ECEAE1` · Gold/mustard `#D6AC68`
- Font: **New Hero**, self-hosted — see "Fonts" below
- Two soft ambient gradients (`.gradient-hero`, `.gradient-lower` in `index.css`) reproduce the mesh-like backdrop behind the hero and the FAQ/blog/footer zone; the insurance, split and FOR sections sit on their own solid navy/mustard blocks in between.

## Fonts

New Hero is the only typeface on the site, self-hosted — no Google Fonts, so no
third-party connection and no render-blocking stylesheet.

**The 20 `.otf` files go in `public/fonts/`**, named `NewHero-Regular.otf`,
`NewHero-SemiBoldItalic.otf` and so on. `public/fonts/_FILENAMES.txt` lists every
expected name and includes a one-liner that renames the foundry's spaced
filenames (`New Hero Bold Italic.otf`) to the hyphenated convention in one pass.

`npm run build` runs `scripts/check-fonts.mjs` first and **refuses to build if
any face is missing**. That guard is load-bearing, not belt-and-braces: Vite only
rewrites a root-absolute `url()` with the configured `base` when the target file
exists in `public/` at build time. With the fonts present,
`/fonts/NewHero-Regular.otf` becomes `/Fortiva-concept/fonts/NewHero-Regular.otf`.
With one missing, Vite leaves the URL alone, the build still succeeds, and
production quietly requests `/fonts/…` at the domain root and falls back to the
system sans everywhere. Licensed fonts are exactly the sort of file that goes
missing in a fresh clone or in CI, so the check makes that a loud local error
instead. `npm run check:fonts` runs it on its own.

All twenty faces are declared in `src/styles/fonts.css`; the browser only
downloads the ones a weight/style combination on the page resolves to (currently
five: 400, 400 italic, 500, 600, 700). Declaring the full range costs nothing at
runtime.

### Weight mapping

New Hero ships ten weights and CSS has nine conventional slots, so UltraLight
takes a non-standard `250` — legal, and it preserves the foundry's ordering.

| Foundry name | CSS weight | Tailwind utility |
|---|---|---|
| Hairline | 100 | `font-thin` · `font-hairline` |
| Thin | 200 | `font-extralight` |
| UltraLight | 250 | `font-ultralight` |
| Light | 300 | `font-light` |
| Regular | 400 | `font-normal` |
| Medium | 500 | `font-medium` |
| SemiBold | 600 | `font-semibold` |
| Bold | 700 | `font-bold` |
| ExtraBold | 800 | `font-extrabold` |
| Super | 900 | `font-black` · `font-super` |

Two of Tailwind's default names disagree with the foundry's: `font-thin` (100) is
New Hero **Hairline**, and `font-extralight` (200) is New Hero **Thin**. The
`font-hairline` / `font-ultralight` / `font-super` aliases in
`tailwind.config.js` exist so you can write the foundry name instead of
remembering that.

`fontFamily.serif` is deliberately also mapped to New Hero, so a stray
`font-serif` can't silently fall back to a system serif.

### Optional: convert to WOFF2

OTF is uncompressed and roughly 3–5× the size of the equivalent WOFF2. Only five
faces load on the homepage today so it isn't urgent, but converting is worth it
before launch and needs no code change beyond the `format()` hint and the file
extensions in `src/styles/fonts.css`.

## Images and the logo

`src/assets/images.ts` is the **only** place any image filename appears — every component imports from it, so replacing an image is purely a file swap in `/public`, no code changes needed.

Images are numbered by where they first appear on the page (`img-1.png` is the hero image, `img-11.png` is the last blog card) and no image is reused anywhere on the site:

| File | Used for |
|---|---|
| `img-1.png` | Hero |
| `img-2.png` / `img-3.png` / `img-4.png` | Insurance cards: Individual / Corporate / Family |
| `img-5.png` | Split section (desktop / tablet) |
| `img-5-mobile.png` | Split section, swapped in below the `sm` breakpoint via `<picture>` |
| `img-6.png` / `img-7.png` / `img-8.png` | FOR section stages: family / employees / you |
| `img-9.png` / `img-10.png` / `img-11.png` | Blog cards 1 / 2 / 3 |
| `logo.svg` | Nav + footer mark |
| `map-placeholder.svg` | Available States section — **placeholder**, swap the file |

Drop files with those exact names into `/public` and they're picked up automatically — nothing 404s once they're there. Any aspect ratio works since every photo is rendered with `object-cover`.

`logo.svg` is expected to be a single-colour mark that already includes the wordmark and tagline — `Logo.tsx` doesn't render any "FORTIVA" text of its own. It applies the file as a CSS `mask-image` on a solid-colour element (rather than a plain `<img>`), so the same file renders navy on light backgrounds and off-white on the navy footer with no second asset needed. Aspect ratio is preserved automatically: an invisible `<img>` of the same file sits underneath at a fixed 32px height to establish the correct width from the file's own intrinsic ratio, and the visible, tinted mask is sized to match — this was tested with a dummy 150×40 SVG and reproduced its exact 3.75:1 ratio, so any real logo file will size correctly without needing its dimensions hard-coded anywhere.

## Notable implementation choices

- **Hero image scroll-scale** — `HeroImage.tsx` scales a `100vw`-wide element via a GSAP `scrub` transform (0.72 → 1) rather than animating `width`, so it stays GPU-accelerated. It now sits flush against the section below (zero gap), with the scale animation's `end` point pulled earlier (`bottom 25%` instead of `bottom 10%`) so it finishes before the image starts scrolling out of view rather than right at the edge.
- **Split section** — full-bleed, 50/50 columns, full viewport height on `sm`+. On mobile it switches to a dedicated `img-5-mobile.png` via `<picture>` and reverses to text-first via `order` utilities (image is `order-2` / content is `order-1` below `sm`, swapped above it).
- **Insurance card hover-expand** — the three cards share one parent that drives each card's `flexGrow` through GSAP on hover (`back.out` easing for the "spring" feel, ~1.4x growth); title/arrow micro-motion is separate CSS `group-hover`.
- **Values stack** — a 350vh section with a `sticky` inner viewport; one scrubbed GSAP timeline brings cards 2–4 up from below in three even thirds of the scroll range, each landing at a rotated "paper" offset (spread across -9° to 6°). Each card also carries a navy overlay whose opacity is driven by the same timeline: every time a new card lands on top of it, every card underneath gets one more `+4%` opacity step, so depth in the stack reads as a subtle depth in colour too.
- **Section order** — `StackedCards` (the four Fortiva pillars) and the Resources band swapped places versus the first build, so the pillars aren't the deepest thing on the page. It's a swap rather than sliding the pillars further up because `ValuesStack` (~430vh) and `StackedCards` (~500vh) are both pinned — adjacent, they'd be ~940vh of unbroken pinned scrolling. `SplitSection` stays between them as the breather.
- **FOR section** — the section most worth reading closely. `F`, `O` and `R` live in a *single* SVG file (`public/for-mask.svg`) consumed as one CSS `mask-image`. The mask is applied to a layer of stacked, plain `object-cover` photos that never move or resize; only the mask's own effective size animates, via a `--mask-scale` CSS custom property (0.85 → 14) driven by GSAP and read back through `mask-size: calc(var(--mask-scale) * 100vw) auto`. That keeps the photo completely static while the "window" onto it grows until the letterforms' edges pass outside the viewport (the first 24% of the section's scroll). After that, continued scrolling crossfades the photo underneath and mask-wipes the label together, in sync, through three stops ("your family." / "your employees." / "YOU."); a `ScrollTrigger.snap` on `[0, 0.24, 0.52, 0.80]` settles the scroll to each stop instead of letting it fly past.
- **`public/for-mask.svg` is a placeholder** — simple block shapes standing in for the real wordmark, deliberately swappable. Drop in real artwork at the same path (roughly the same `viewBox` proportions — currently `0 0 1200 400`, a 3:1 width:height ratio — will line up best) and nothing else needs to change; only the shape's silhouette/alpha matters since it's consumed purely as a mask.
- **Orphan control is two base-layer rules, not forty utility classes** — `body` gets `text-wrap: pretty` and `h1`–`h6` get `text-wrap: balance` (`index.css`). `text-wrap` is inherited, so the `body` rule reaches text in plain `<span>`s and `<button>`s that a `p, li` selector would miss — the FAQ question labels and the numbered step titles, for instance. Because it arrives by inheritance it can never beat a direct declaration, so a `text-pretty` / `text-balance` / `text-nowrap` utility still wins on the element it's on. Headings take `balance` instead because `pretty` only rescues the *last* line, whereas `balance` evens out all of them — the difference between fixing "Enrollment made / simple" and also tidying the ragged line above it. The catch is that Chrome caps `balance` at 6 lines and silently reverts past that; measured at 390px the tallest heading here is the hero H1 at 5 lines, so all of them are inside the cap. A much longer heading added later should get `text-pretty`, which has no line limit. Measured effect: orphaned last lines went from 7 → 0 at 1440px and 17 → 1 at 390px. Chrome/Edge 117+ and Safari 26+; Firefox ignores both and simply wraps as before.
- **Squircles, not pills** — buttons and their icon badges use fixed-radius corners rather than `rounded-full`: 20px/14px at the hero's 56px button size, 12px/10px everywhere else, 24px on the floating nav. Layered on top is a `.corner-smooth` class (`index.css`) using the new CSS `corner-shape: superellipse(1.6)` — "60%" on Figma's smoothing convention, interpolated onto the spec's own round(1)→squircle(2) scale — applied to buttons, the nav, and every card. It's Chromium-only as of mid-2026 and degrades gracefully to the plain border-radius elsewhere, so it's a no-downside enhancement rather than something everyone will see today.
- **Values stack now holds five cards** — Fortiva's five real brand values, replacing the four placeholders that were written to match the reference screenshot's tone. Everything about the section's geometry and pacing is now derived from `values.length` (offset table, timeline loops, section height, stack height), so a sixth value needs no code change. `PER_TRANSITION_VH = 83` reproduces the approved four-card pacing exactly: that build was 350vh with a 100vh sticky viewport, so (350 − 100) / 3 ≈ 83vh per card.
- **Navbar dropdowns hide via opacity, not `visibility`** — deliberately. `visibility` is a discrete property, so under `transition-all` its flip lands *halfway* through the transition; for ~100ms after opening, a panel was still `visibility: hidden` and silently refused focus, which broke ArrowDown-into-panel. Panels now transition only `opacity` and `transform`, and hide with `opacity-0 + pointer-events-none + aria-hidden`, which also lets them animate on the way out.
- **Resources band, not a blog grid** — the copy doc supplies no article titles, so the three cards are Videos / Plan details / Blog, each of which does have written copy and a button in the doc. `components/Blog/Blog.tsx` is intentionally left in the repo, unimported, ready for when real articles exist.
- **Stay connected form has no submit target** — `submitLead()` in `StayConnected.tsx` validates, shows the success state and logs the payload. It does not send anything anywhere. Point it at the CRM or form endpoint and nothing else needs to change.
- Respects `prefers-reduced-motion`: every scroll-driven animation is replaced with a static, fully-visible end state instead of being skipped outright.

## For Members — the six pages

All six pages under For Members are built, plus `/members` itself as the section
index (the nav renders that one as a dropdown trigger, but the footer links it
directly, so it needed a real page rather than the ComingSoon fallback). Copy is
`FTVA_Web Copy.odt`'s "For Members" section, complete and unabridged — including
the three-paragraph answer to "How do I enroll", which the homepage FAQ band
shortens to its first paragraph.

| Route | Page | Set-piece |
|---|---|---|
| `/members` | Section index | six derived cards |
| `/members/find-a-doctor` | Find a Doctor | search entry band + `ScrollSpyList` |
| `/members/virtual-care` | Virtual Care | `StepFlow` + `StatBand` |
| `/members/resources` | Resources | `LinkHub` |
| `/members/faqs` | FAQs | `FaqExplorer` |
| `/members/app` | Download the App | `PhoneShowcase` |
| `/members/portal` | Member Portal | `PortalShowcase` |

Seven new components came with them, each the section it's named after:
`FeatureReveal`, `ScrollSpyList`, `StepFlow`, `StatBand`, `LinkHub`,
`FaqExplorer`, `PhoneShowcase`, `PortalShowcase` and `CtaBand`. Each carries its
own reasoning in a docblock; the decisions worth knowing before editing them are
below.

### No photographs on any of them

Six pages arrived with no new image assets, and the table above in "Images and
the logo" records that no image on this site is reused anywhere. Quietly
repurposing the hero or insurance-card photos across six pages would have broken
that on the first page and made the claim untrue everywhere. So these pages are
built from type, tinted surfaces, the Fortiva mark and purpose-drawn interface
mockups — which is a coherent look rather than a compromise, and leaves an obvious
slot for real photography when it exists.

### The interface mockups contain no invented member data

`PhoneShowcase` and `PortalShowcase` both draw abstract screens: blocks, bars,
pins and a stand-in for a scannable code. Not one contains a balance, a claim
number, a deductible or a name. A mockup showing "$1,240 remaining" or "Claim
#48213 — approved" would be inventing member data on the two pages whose whole
subject is what those screens show you, and a reviewer would then have to work
out which parts were product decisions and which were filler. Each screen
communicates its *shape* — a summary, a map, a bar chart, an ID card, a
conversation, a table, a form — and asserts nothing about its contents.

### Five destinations the doc never gives a URL for

`externalTargets` in `content/site.ts` holds the provider directory, MyLiveDoc,
the portal sign-in and the two app-store listings. All five ship as `'#'` rather
than as a plausible-looking guess. `components/ActionButton.tsx` reads
`isPlaceholderHref` and, while the href is still `'#'`, swallows the click,
marks the control as unavailable and explains why in a `title`. Drop real URLs
into `content/site.ts` and every one of those behaviours switches off by itself —
the buttons start opening in a new tab and no component needs editing.

### The two genuine copy gaps

- **"Tips for talking to your doctor"** — the doc has the heading and nothing
  under it. Rather than ship a visible hole or put Fortiva-voiced advice in the
  client's mouth, that section carries six questions any patient can ask any
  clinician and three things to bring. Nothing in it asserts anything about
  Fortiva, its plans or its network, and none of it is medical advice, so it can
  be replaced wholesale. Marked `PLACEHOLDER — TODO(client)` in the source.
- **The video library** — the doc asks for a video section and supplies the intro
  line, but no titles, URLs, thumbnails or durations. It used to be one empty
  player frame that said so out loud, which showed the shape but couldn't show
  the *interaction*. It is now `VideoLibrary` populated from `videoLibrary` in
  `pages/MembersResources.tsx`: six member-onboarding topics with titles, blurbs,
  descriptions, tags and durations, playing Google's public sample clips. Every
  field in that array is invented and the block is marked
  `PLACEHOLDER — TODO(client)`, with a list of exactly what changes when the real
  library lands. Authored durations do **not** match the sample clips' real run
  times; real files fix that by themselves. Thumbnails are gradient plates with
  the topic's glyph, not frame grabs — there are no real stills, and every image
  in this build is a commissioned asset used exactly once.

One line was **added** rather than reproduced: an emergency carve-out on the
Virtual Care page ("Not for emergencies…"). A telehealth page without one is the
single omission worth flagging instead of copying; it's unbranded, and marked
`ADDED — TODO(client)` for legal to word properly.

### FAQ copy has one home now

`memberFaqs` in `content/site.ts` holds all eight questions, and
`HOMEPAGE_FAQ_INDEXES` says which four the homepage band shows. `FAQ.tsx` used to
hold its own hard-coded duplicate of four answers, so an edit on the FAQs page
silently disagreed with the homepage.

## The five-card sections

Three pages carry a five-item benefits list — Plans → Individuals & Families,
Plans → Employers and For Members → Virtual Care — and all three now render it
through `FeatureReveal`: copy holds the left column, and the five cards fly up
from below the fold into a staggered two-column layout, one after another, as you
scroll past. `FeatureGrid` (the plain grid the three of them used to sit in) has
been deleted; `Feature` itself still lives in `components/featureTypes.ts` rather
than being exported from `FeatureReveal`, so a second renderer can be added later
without every call site re-pointing its import.

Virtual Care's section gained a lead paragraph and two buttons that the copy doc
does not supply — the split layout has a left column to fill, and the lead only
restates what the five cards already say. Both are marked `ADDED` in the source.

**Spacing.** One gap value, `gap-5`, in both axes. Two earlier attempts at the
staggered look each broke that. `sm:mt-14` on the odd cards put its 56px into the
first row's *height*, so the gap under a card measured 76px against a 20px column
gap. `items-start` was subtler: cards left to size themselves differ in height by
however many lines of body copy separate them, and all that slack lands in the gap
below the shorter one — 65px, and it moves whenever the copy is edited. The fix is
no `items-start` (rows stretch, so both cards in a row match and every vertical gap
is exactly the row gap) plus `relative` + `sm:top-14` for the offset, which paints
the odd cards lower without touching the row boxes. It has to be `top` and not
`translate-y`, because the reveal animation owns the transform.

The hand-drawn gold rule that used to sit under the heading is **gone** — on all
three pages, since it lived in the shared component.

The section is deliberately **not pinned**. A tall section with a sticky 100vh
viewport (the `ValuesStack` shape) was tried and abandoned: heading, lead, button
and five two-column cards measure ~830px, so on any laptop under ~900px tall the
bottom card clipped, and pinning also costs ~110vh of extra scrolling on two pages
that already run long. Instead the cards animate against a **fixed 60vh scroll
window** (`top 78%` → `top 18%`), which is independent of both the section's height
and the viewport's — every card is in place after 60vh of scrolling whatever the
copy measures. Below `lg` each card gets its own trigger and rises 48px as it
enters, because one shared 60vh window on a ~1200px-tall stacked column would
place cards that are still far below the fold.

## The video library opens in place

`components/VideoLibrary` — For Members → Resources. A grid of thumbnails; click
one and a full-width row slides in **directly beneath the row that card sits in**,
player on the left, title, description, duration, tags and a follow-on link on the
right. The card stays in the grid, ringed in gold and badged "Now playing".

Under the row, not at the foot of the grid: a panel pinned to the bottom can be two
rows of thumbnails away from the card that opened it, at which point a visitor has
lost track of what they clicked.

That insertion index can't come from CSS — it depends on how many columns the grid
currently has, which is a breakpoint fact. So `cols` is tracked off the *same* two
media queries the grid's own `sm:`/`lg:` prefixes compile to, and the panel is
rendered after the last card of the selected card's row, spanning every column. The
two must change together; a panel inserted mid-row silently pushes a card into the
next one. Resizing across a breakpoint re-places the panel live.

Opening and switching are different animations on purpose. Opening from closed runs
height 0 → auto, because the grid genuinely has to make room. Switching while the
panel is already open cross-fades the contents instead — collapsing to zero and
re-expanding at the same size reads as a flinch. Closing has to animate *before*
React unmounts the element, so the collapse clears the selection in its
`onComplete`. Every path ends in `ScrollTrigger.refresh()`: adding or removing a row
changes the document height and invalidates every scroll trigger below it.

One detail worth knowing before editing a card: the scroll reveal lives on a wrapper
`div`, not on the card `button`. `useScrollReveal` finishes by writing an inline
`transform`, which beats Tailwind's `hover:-translate-y-*` class — a card can't both
animate in and lift on hover unless the two sit on different elements.

## The homepage's lower band

`.gradient-band-in` and `.gradient-band-out` (in `index.css`) are one gradient
authored as two halves — cream at the top of the FAQ, the faintest cool tint
exactly on the FAQ/Availability seam, cream again by the end of Availability. Two
classes rather than one wrapper because the two sections are never the same height
(the FAQ grows and shrinks as answers open), so a single mid-stop at 50% would put
the turnaround inside whichever section happened to be taller and move it every
time someone opened an accordion. The tint is cream nudged ~3% toward the brand's
mist blue: measured down the band it runs 236,234,225 → 228,233,236 → 236,234,225.
`AvailableStates` dropped its own `bg-cream` to sit in it. `.gradient-lower` is
unchanged and still used by Plans → Employers, where a full there-and-back ramp
inside one self-contained section is the right shape.

The contact form (`StayConnected`) moved off navy onto **gold**. It was the
footer's exact colour, and the footer opens with a closing CTA of its own, so the
two read as one dark slab and the form lost its status as a separate ask. The
contrast doesn't resolve the obvious way: white on gold measures 2.1:1, under the
3:1 that even display type needs, so the emphasis inverts — the accent word takes
full navy and the rest of the line is held at 70%, with body copy at 80% for
4.7:1. Same rule in `CtaBand`'s gold tone, and it's why every For Members page
closes on gold: light → gold → navy is now the site's closing signature.

## If something needs adjusting

- Swap any photo by editing its URL in `src/assets/images.ts`.
- Section order/composition lives in `src/App.tsx`.
- Which pages are live is `src/config/pages.ts` — one `enabled` flag per route, nothing else to touch. See "Switching pages on and off".
- The FOR section's pacing (how much of the scroll goes to the mask reveal vs. the text cycling) is controlled by the position numbers in `ClipMaskSection.tsx`'s `useEffect` — they're on a 0–100 scale representing percent of that section's scroll range.
