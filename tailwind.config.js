/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#11284B',
          50: '#EDF0F4',
          100: '#D6DDE6',
          400: '#3A5178',
          600: '#1A3459',
          700: '#152C4E',
          800: '#11284B',
          900: '#0B1B34',
        },
        /* ── The beige is gone ────────────────────────────────────────────
           `cream` was #ECEAE1 — the page's own surface and the end stop of
           every gradient — and `cream.soft` was #F3F5EE, the near-white used
           for cards, the nav pill and the `light` button. Both are #CCD0D2 now,
           the same value as `ash`, so there is no beige left in the palette.

           The two NAMES are kept rather than rewritten to `ash` across 42 call
           sites, and they still mean different things at one value: `cream` is
           "the page's own surface", `cream-soft` is "a surface sitting on the
           page". If they ever need to diverge again, they diverge here.

           One consequence to know about: a `cream-soft` card on a `cream`
           section is now exactly the colour of the section, so those cards are
           separated by their shadow alone rather than by tone. That is the
           intended result, not an oversight.

           `cream-soft` was also doing a second, unrelated job — LIGHT INK on
           navy, in the footer, the ghost button's hover, the FAQ and LinkHub
           rails and the map tooltip. Grey text on navy is not the same request
           as a grey surface, so all 12 of those were switched to pure white
           and none of them read this token any more. */
        cream: {
          DEFAULT: '#CCD0D2',
          soft: '#CCD0D2',
        },
        gold: {
          DEFAULT: '#D5AC67',
          light: '#E4C48E',
          dark: '#BD9455',
        },
        mist: {
          DEFAULT: '#BCCAD1',
        },
        /* ── The 2026 colour pass: reference values, deliberately unused ────
           `teal` is the logo's own #0074A6 (see the fills listed in Logo.tsx),
           `teal.light` the pale blue the Find a Doctor search band is drawn on,
           and `ash` the grey behind About's values stack and several sections on
           the Plans and Members pages. They are the canonical hexes, kept here so
           there is one place to read them.

           Nothing references them, and that is on purpose — reversing an earlier
           decision in this file, for a reason worth recording.

           A utility whose colour comes from `theme` only EXISTS if the build that
           produced the stylesheet resolved the config defining it. When it hasn't
           — a dev server that never re-read tailwind.config.js is the everyday way
           — the class is not an error and does not fall back. It is simply never
           emitted, the element gets no background, and whatever is behind it shows
           through. `bg-teal-light` failing that way is what made the #A5CDD9 search
           band render as the body's #CCD0D2, three times, with correct source and a
           correct production build.

           So every section surface and hairline added in this pass writes its value
           literally at the point of use — `bg-[#A5CDD9]`, `bg-navy-800/[0.08]`.
           Those are generated from the class string, so they cannot be absent while
           the class is present. The cost is a hex repeated across a few files; the
           thing it buys is that no section can silently lose its background.

           Pre-existing keys (navy-800, gold, mist, cream) are used normally
           throughout — they predate this and carry no such risk. */
        teal: {
          DEFAULT: '#0074A6',
          dark: '#005A80',
          light: '#A5CDD9',
        },
        ash: {
          DEFAULT: '#CCD0D2',
        },
      },
      fontFamily: {
        // New Hero is the only typeface on the site. `serif` is overridden too
        // so a stray `font-serif` can't silently fall back to a system serif.
        sans: ['"New Hero"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"New Hero"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        // Foundry-named aliases for the three weights whose Tailwind default
        // name doesn't match New Hero's own. See src/styles/fonts.css for the
        // full mapping — the trap is that `font-thin` (100) is New Hero
        // *Hairline*, and `font-extralight` (200) is New Hero *Thin*.
        hairline: '100',
        ultralight: '250',
        super: '900',
      },
      // ── The pinned-set-piece breakpoint ──────────────────────────────────
      // Three sections (FeatureReveal, PhoneShowcase, ScrollSpyList) pin
      // themselves to the viewport and run their reveal while the page is held
      // still. Pinning an element taller than the viewport clips its bottom, so
      // it only happens where there is both width for the two-column layout and
      // height for the whole section: this query is that condition, and the
      // `pin:` variants are the trimming that makes the section fit it.
      //
      // MUST stay identical to PIN_QUERY in src/animations/pinnedSequence.ts —
      // CSS decides the layout, JS decides the behaviour, and if the two
      // disagree a section either pins while too tall (clipped) or trims itself
      // while unpinned (needlessly cramped).
      //
      // Declared last so `pin:` utilities are emitted after `lg:` ones and win
      // where both set the same property (`lg:sticky pin:static`).
      screens: {
        pin: { raw: '(min-width: 1024px) and (min-height: 760px)' },
      },

      borderRadius: {
        xl2: '1.75rem',
        card: '2rem',
      },
      maxWidth: {
        container: '1360px',
      },
      boxShadow: {
        soft: '0 20px 60px -20px rgba(17, 40, 75, 0.25)',
        card: '0 24px 48px -24px rgba(17, 40, 75, 0.35)',
        // Half the weight of `card`, and lifted further off the surface (a
        // wider blur against a smaller spread). Used by StackedCards, whose
        // cards now sit on gold rather than cream — a navy shadow at 0.35
        // reads as a grey smudge against a saturated background, where the
        // same shadow on cream just read as depth.
        'card-soft': '0 18px 44px -26px rgba(17, 40, 75, 0.18)',
      },
    },
  },
  plugins: [],
}
