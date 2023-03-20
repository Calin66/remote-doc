/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // fontFamily: {
      //   poppins: ["var(--font-poppins)"],
      //   edu_NSW_ACT_Foundation: ["var(--font-edu_NSW_ACT_Foundation)"],
      // },
      colors: {
        c1: "#8ECAE6",
        c2: "#219EBC",
        c3: "#023047",
        c4: "#FFB703",
        c5: "#FB8500",
        c6: "#4364fa",
      },
      minHeight: {
        hatz: "80vh",
      },
      padding: {
        miniHatz: "9vw",
      },
      boxShadow: {
        "3xl": "0px 10px 40px -5px #8ECAE6",
        "4xl": "0px 6px 40px -15px #FB8500",
      },
    },
  },
  plugins: [],
};
