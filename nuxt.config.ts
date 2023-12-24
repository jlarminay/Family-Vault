import { resolve } from 'node:path';

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    'nuxt-quasar-ui',
    'dayjs-nuxt',
    'fluent-ffmpeg',
    '@sidebase/nuxt-auth',
  ],
  css: ['@/assets/css/tailwind.css'],
  build: {
    transpile: ['trpc-nuxt'],
  },
  alias: {
    cookie: resolve(__dirname, 'node_modules/cookie'),
  },

  // environment variables
  runtimeConfig: {
    auth: {
      secret: process.env.NEXTAUTH_SECRET,
    },
    github: {
      // call back url = http://localhost:3000/api/auth/callback/github
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
    discord: {
      // call back url = http://localhost:3000/api/auth/callback/discord
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    },
    public: {},
  },

  auth: {
    provider: {
      type: 'authjs',
    },
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
