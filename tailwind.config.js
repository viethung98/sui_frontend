/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Healthcare color palette
        primary: {
          50: '#ECFEFF',
          100: '#CFFAFE',
          200: '#A5F3FC',
          300: '#67E8F9',
          400: '#22D3EE',
          500: '#0891B2',
          600: '#0E7490',
          700: '#155E75',
          800: '#164E63',
          900: '#1E3A8A',
        },
        success: {
          50: '#ECFDF5',
          500: '#059669',
          600: '#047857',
        },
        background: {
          light: '#F8FAFC',
          dark: '#0F172A',
        },
        text: {
          light: '#1E293B',
          dark: '#F1F5F9',
          muted: '#475569',
        },
        border: {
          light: '#E2E8F0',
          dark: '#334155',
        },
      },
      fontFamily: {
        heading: ['Lexend', 'sans-serif'],
        body: ['Source Sans 3', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
