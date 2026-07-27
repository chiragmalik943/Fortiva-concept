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
├── hooks/             useLenis, useSplitReveal, useScrollReveal — shared animation logic
├── animations/        gsap.ts — single place ScrollTrigger gets registered
├── assets/images.ts    every Unsplash URL in one place
└── styles/index.css    Tailwind + Lenis required CSS + the two ambient gradients
```

## Design tokens

Pulled directly by sampling the reference screenshot rather than eyeballing:

- Navy `#11284B` · Cream `#ECEAE1` · Gold/mustard `#D6AC68`
- Font: Familjen Grotesk, loaded via Google Fonts in `index.html`
- Two soft ambient gradients (`.gradient-hero`, `.gradient-lower` in `index.css`) reproduce the mesh-like backdrop behind the hero and the FAQ/blog/footer zone; the insurance, split and FOR sections sit on their own solid navy/mustard blocks in between.

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

Drop files with those exact names into `/public` and they're picked up automatically — nothing 404s once they're there. Any aspect ratio works since every photo is rendered with `object-cover`.

`logo.svg` is expected to be a single-colour mark that already includes the wordmark and tagline — `Logo.tsx` doesn't render any "FORTIVA" text of its own. It applies the file as a CSS `mask-image` on a solid-colour element (rather than a plain `<img>`), so the same file renders navy on light backgrounds and off-white on the navy footer with no second asset needed. Aspect ratio is preserved automatically: an invisible `<img>` of the same file sits underneath at a fixed 32px height to establish the correct width from the file's own intrinsic ratio, and the visible, tinted mask is sized to match — this was tested with a dummy 150×40 SVG and reproduced its exact 3.75:1 ratio, so any real logo file will size correctly without needing its dimensions hard-coded anywhere.

## Notable implementation choices

- **Hero image scroll-scale** — `HeroImage.tsx` scales a `100vw`-wide element via a GSAP `scrub` transform (0.72 → 1) rather than animating `width`, so it stays GPU-accelerated. It now sits flush against the section below (zero gap), with the scale animation's `end` point pulled earlier (`bottom 25%` instead of `bottom 10%`) so it finishes before the image starts scrolling out of view rather than right at the edge.
- **Split section** — full-bleed, 50/50 columns, full viewport height on `sm`+. On mobile it switches to a dedicated `img-5-mobile.png` via `<picture>` and reverses to text-first via `order` utilities (image is `order-2` / content is `order-1` below `sm`, swapped above it).
- **Insurance card hover-expand** — the three cards share one parent that drives each card's `flexGrow` through GSAP on hover (`back.out` easing for the "spring" feel, ~1.4x growth); title/arrow micro-motion is separate CSS `group-hover`.
- **Values stack** — a 350vh section with a `sticky` inner viewport; one scrubbed GSAP timeline brings cards 2–4 up from below in three even thirds of the scroll range, each landing at a rotated "paper" offset (spread across -9° to 6°). Each card also carries a navy overlay whose opacity is driven by the same timeline: every time a new card lands on top of it, every card underneath gets one more `+4%` opacity step, so depth in the stack reads as a subtle depth in colour too.
- **FOR section** — the section most worth reading closely. `F`, `O` and `R` live in a *single* SVG file (`public/for-mask.svg`) consumed as one CSS `mask-image`. The mask is applied to a layer of stacked, plain `object-cover` photos that never move or resize; only the mask's own effective size animates, via a `--mask-scale` CSS custom property (0.85 → 14) driven by GSAP and read back through `mask-size: calc(var(--mask-scale) * 100vw) auto`. That keeps the photo completely static while the "window" onto it grows until the letterforms' edges pass outside the viewport (the first 24% of the section's scroll). After that, continued scrolling crossfades the photo underneath and mask-wipes the label together, in sync, through three stops ("your family." / "your employees." / "YOU."); a `ScrollTrigger.snap` on `[0, 0.24, 0.52, 0.80]` settles the scroll to each stop instead of letting it fly past.
- **`public/for-mask.svg` is a placeholder** — simple block shapes standing in for the real wordmark, deliberately swappable. Drop in real artwork at the same path (roughly the same `viewBox` proportions — currently `0 0 1200 400`, a 3:1 width:height ratio — will line up best) and nothing else needs to change; only the shape's silhouette/alpha matters since it's consumed purely as a mask.
- **Squircles, not pills** — buttons and their icon badges use fixed-radius corners rather than `rounded-full`: 20px/14px at the hero's 56px button size, 12px/10px everywhere else, 24px on the floating nav. Layered on top is a `.corner-smooth` class (`index.css`) using the new CSS `corner-shape: superellipse(1.6)` — "60%" on Figma's smoothing convention, interpolated onto the spec's own round(1)→squircle(2) scale — applied to buttons, the nav, and every card. It's Chromium-only as of mid-2026 and degrades gracefully to the plain border-radius elsewhere, so it's a no-downside enhancement rather than something everyone will see today.
- **Values copy** — only the "Integrity" card's body text is legible in the reference screenshot; the other three (Client Focus, Risk Resilience, Expertise) are written to match its tone, since that content isn't visible in the source image.
- **Placeholder content kept as-is** — the repeated "A clear scope and a shared understanding of what needs to change" bullets and the "TAG" blog labels are reproduced exactly as they appear in the reference, since they read as intentional placeholder copy in the source design.
- Respects `prefers-reduced-motion`: every scroll-driven animation is replaced with a static, fully-visible end state instead of being skipped outright.

## If something needs adjusting

- Swap any photo by editing its URL in `src/assets/images.ts`.
- Section order/composition lives in `src/App.tsx`.
- The FOR section's pacing (how much of the scroll goes to the mask reveal vs. the text cycling) is controlled by the position numbers in `ClipMaskSection.tsx`'s `useEffect` — they're on a 0–100 scale representing percent of that section's scroll range.
