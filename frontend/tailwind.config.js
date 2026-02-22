/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FAF7F2',
          dark: '#F0EBE1',
        },
        terracotta: {
          DEFAULT: '#C4603B',
          light: '#E8895F',
          pale: '#F5E6DF',
        },
        olive: {
          DEFAULT: '#6B7C4D',
          light: '#8A9E61',
        },
        brown: {
          dark: '#2C1810',
          mid: '#5C3D2E',
          light: '#8B6355',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
