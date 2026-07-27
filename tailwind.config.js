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
        sans: ['"Familjen Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
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
      },
    },
  },
  plugins: [],
}
