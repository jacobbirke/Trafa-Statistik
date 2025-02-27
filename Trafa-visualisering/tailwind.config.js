/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/tailwind");
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", flowbite.content()],
  theme: {
    extend: {
      colors: {
        trafaPrimary: "#b90066",
        trafaGreen: "#52af32",
        trafaBlue: "#0083ab",
        trafaOrange: "#ec6608",
        trafaPurple: "#4c5cc5",
      },
    },
  },
  plugins: [flowbite.plugin()],
};
