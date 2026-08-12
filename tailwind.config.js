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
        cream: {
          DEFAULT: '#ECEAE1',
          soft: '#F3F5EE',
        },
        gold: {
          DEFAULT: '#D5AC67',
          light: '#E4C48E',
          dark: '#BD9455',
        },
        mist: {
          DEFAULT: '#BCCAD1',
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
