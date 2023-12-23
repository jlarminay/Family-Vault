/** @type {import('tailwindcss').Config} */
export default {
  prefix: 'tw_',
  content: [],
  theme: {
    extend: {
      colors: {
        primary: '#833deb',
        secondary: '#ee3664',
        accent: '#82B1FF',
        dark: '#362b2f',
        positive: '#21BA45',
        negative: '#C10015',
        info: '#31CCEC',
        warning: '#F2C037',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        'maven-pro': ['Maven Pro', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
