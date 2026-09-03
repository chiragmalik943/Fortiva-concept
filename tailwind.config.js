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
        /* ── Both of these are WHITE now ──────────────────────────────────
           The history, because the names still say "cream": `cream` was #ECEAE1
           and `cream.soft` #F3F5EE (a warm off-white for cards, the nav pill and
           the `light` button); then both became #CCD0D2, the same grey as `ash`.
           That second step is what made the site read as grey-on-grey — the page
           itself was #CCD0D2, every card and button was #CCD0D2, and roughly a
           dozen sections either declared `bg-cream-soft` or declared nothing and
           inherited the body. Whatever tonal variety the layout had came from the
           navy, gold and teal plates alone.

           So this is the single knob that turns the page white. `cream` is "the
           page's own surface" and `cream-soft` is "a surface sitting on the page",
           and at #FFFFFF both are the same thing, which is correct: the page is
           white and the things on it are white.

           ── Where the grey went instead ─────────────────────────────────────
           Grey is now a SECTION colour and nothing else, spent deliberately in
           nine places: Home's hero ramp and its FAQ → Availability tint band,
           About's ValuesStack, MembersHub's card grid, Find a Doctor's spy list
           and the ramp under it, Plans → Employers' closing ramp, PortalShowcase,
           and StepFlow / CtaBand's opt-in `cream` surface. Every one of those
           writes #CCD0D2 literally at the point of use, for the reason set out in
           the `ash` note below — a section must not be able to lose its
           background because a utility wasn't emitted.

           ── The consequence to know about ───────────────────────────────────
           A white card on a white section has nothing but its shadow, and a few
           cards had no shadow at all. Those took a `border-navy-800/[0.08]`
           hairline in the same pass (FeatureReveal, DocumentShelf, VideoLibrary's
           closed state, FaqExplorer's empty state, Virtual Care's treats card),
           and `Button`'s `light` and `ghost` variants took a navy ring for the
           same reason — a white button on a white section needs an edge. If a new
           white card looks like it is floating in nothing, that hairline is the
           fix, not a grey fill. */
        cream: {
          DEFAULT: '#FFFFFF',
          soft: '#FFFFFF',
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
