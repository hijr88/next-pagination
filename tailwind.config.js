const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "light-blue": "rgb(var(--light-blue) / <alpha-value>)",
        blue: {
          DEFAULT: "rgb(var(--blue) / <alpha-value>)",
        },
        "dark-blue": "rgb(var(--dark-blue) / <alpha-value>)",
        red: {
          DEFAULT: "rgb(var(--red) / <alpha-value>)",
        },
        "light-black": "var(--light-black)"
      },
    },
  },
  plugins: [
    plugin(function ({ addBase }) {
      addBase({});
    }),
  ],
};
