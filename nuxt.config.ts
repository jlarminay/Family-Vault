import { fileURLToPath } from 'url';

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', 'nuxt-quasar-ui', 'dayjs-nuxt'],
  css: ['@/assets/css/tailwind.css'],
  build: {
    transpile: ['trpc-nuxt'],
  },
  runtimeConfig: {
    // public
    public: {},

    // private
  },

  quasar: {
    extras: {
      fontIcons: ['material-icons-outlined'],
    },
    iconSet: 'material-symbols-outlined',
    config: {
      brand: {
        primary: '#833deb',
        secondary: '#ee3664',
        accent: '#82B1FF',
        dark: '#362b2f',
        positive: '#21BA45',
        negative: '#C10015',
        info: '#31CCEC',
        warning: '#F2C037',
      },
    },
  },
});
