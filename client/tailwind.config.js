/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/Components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  important: true,
  theme: {
    screens: {
      xs: { min: "280px", max: "389px"},
      sm: { min: "390px", max: "819px" },
      md: { min: "820px", max: "1023px" },
      lg: { min: "1024px", max: "1980px" },
      xl: { min: "2560px" },
    },
    backgroundImage: theme => ({
      'hero-pattern': "url('/assets/images/plogging.png')",
    }),
    extend: {
      colors: {
        main: {
          red: '#FF6B6B',
          yellow: '#FFD93D',
          green: '#6BCB77',
          blue: '#4D96FF',
          insta: '#f783ac'
        },
      },
      whitespace: ['responsive', 'hover'],
      fontFamily: {
        common: ['Pretendard','sans-serif'],
      },
    },
  },
  plugins: [],
}
