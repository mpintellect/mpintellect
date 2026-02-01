module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: ['hero-logo'], // ✅ prevents purging
  theme: {
    extend: {},
  },
  plugins: [],
};