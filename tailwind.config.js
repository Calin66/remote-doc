/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        c1: "#780000",
        c2: "#C1121F",
        c3: "#FDF0D5",
        c4: "#003049",
        c5: "#669BBC",
      },
    },
  },
  plugins: [],
};
