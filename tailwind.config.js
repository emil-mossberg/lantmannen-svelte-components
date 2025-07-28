/** @type {import('tailwindcss').Config} */
export default {
  prefix: 'tw-',
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        "green-pea": "#1E6E37",
        sand: "#ECE2D6",
        "sand-light": "#F4EEE6",
        "sand-dark": "#E2D4C2",
        "forest-green": "#23A73F",
        "yellow-green": "#D7E187",
        alto: "#D6D6D6",
        swirl: "#D4CEC4",
        oxley: "#7C9E87",
        charcoal: "#201E1A",
        black: "#000",
        tannenbaum: "#005720",
        mercury: "#E6E6E6",
        cerulean: "#0192D0",
        "yellow-sea": "#FAAF00",
        "alizarin-crimson": "#EF2834",
        desert: "#B95D25",
        monza: "#CE0B17",
        nobel: "#B3B3B3",
        "steel-blue": "#4B7DB9",
      },
    },
    fontFamily: {
				lantmannenSerif: ['LantmannenSerif', 'serif'],
				lantmannenSans: ['LantmannenSans', 'sans-serif'],
			},
  },
  plugins: [],
};
