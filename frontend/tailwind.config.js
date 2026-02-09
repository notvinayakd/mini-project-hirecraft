/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0D10',
        primary: '#EDEDED',
        secondary: '#A1A1AA',
        accent: '#7C7CFF',
        glass: 'rgba(255, 255, 255, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['General Sans', 'Satoshi', 'sans-serif'],
      },
      transitionTimingFunction: {
        'custom-ease': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
