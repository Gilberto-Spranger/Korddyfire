/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // necessário para dark/light mode com classe
  theme: {
    extend: {
      fontSize: {
        xxs: '0.625rem',
      },
      animation: {
        'spin-slow': 'spin 6s linear infinite',
      },
    },
  },
  plugins: [],
};

