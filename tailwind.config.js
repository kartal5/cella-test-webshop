/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navbar-green': '#758767',
        'header-beige': '#e6dfd4',
        'category-color': '#F1EBE2',
        'read-btn-color': '#4e642c',
      },
    },
  },
  plugins: [],
}