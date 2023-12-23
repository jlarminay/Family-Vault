import { resolve } from 'node:path';

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    'nuxt-quasar-ui',
    'dayjs-nuxt',
    'fluent-ffmpeg',
    '@hebilicious/authjs-nuxt',
  ],
  css: ['@/assets/css/tailwind.css'],
  build: {
    transpile: ['trpc-nuxt'],
  },
  alias: {
    cookie: resolve(__dirname, 'node_modules/cookie'),
  },
  runtimeConfig: {
    authJs: {
      secret: process.env.NEXTAUTH_SECRET, // You can generate one with `openssl rand -base64 32`
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    },
    public: {
      authJs: {
        baseUrl: process.env.NUXT_NEXTAUTH_URL, // The URL of your deployed app (used for origin Check in production)
        verifyClientOnEveryRequest: true, // whether to hit the /auth/session endpoint on every client request
      },
    },
  },

  // auth: {
  //   strategies: {
  //     github: {
  //       clientId: process.env.GITHUB_CLIENT_ID,
  //       clientSecret: process.env.GITHUB_CLIENT_SECRET,
  //     },
  //     discord: {
  //       clientId: process.env.DISCORD_CLIENT_ID,
  //       clientSecret: process.env.DISCORD_CLIENT_SECRET,
  //     },
  //   },
  // },

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
