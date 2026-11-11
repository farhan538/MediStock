
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#009B77",
        darkGreen: "#063F38",
        mint: "#DDF8F0",
      },
    },
  },
  plugins: [],
};
