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
    s3: {
      bucket: process.env.S3_BUCKET,
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.S3_REGION,
      accessKey: process.env.S3_ACCESS_KEY,
      secretKey: process.env.S3_SECRET_KEY,
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
      fontIcons: ['material-icons-outlined', 'fontawesome-v6'],
    },
    iconSet: 'material-symbols-outlined',
    config: {
      brand: {
        primary: '#833deb',
        secondary: '#ee3664',
        accent: '#82B1FF',
        dark: '#2c2c2c',
        positive: '#21BA45',
        negative: '#C10015',
        info: '#31CCEC',
        warning: '#F2C037',
      },
    },
  },
});
