/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        c1: "#8ECAE6",
        c2: "#219EBC",
        c3: "#023047",
        c4: "#FFB703",
        c5: "#FB8500",
      },
      minHeight: {
        hatz: "85vh",
      },
      padding: {
        miniHatz: "9vw",
      },
    },
  },
  plugins: [],
};
