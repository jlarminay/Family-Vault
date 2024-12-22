import { resolve } from 'node:path';

export default defineNuxtConfig({
  telemetry: false,
  ssr: false,
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    'nuxt-quasar-ui',
    'dayjs-nuxt',
    '@sidebase/nuxt-auth',
    '@vite-pwa/nuxt',
  ],
  plugins: ['~/plugins/global-imports.ts'],
  css: [
    '@/assets/css/tailwind.css',
    '@/assets/css/quasar.css',
    '@/assets/css/overrides.css',
    '@/assets/css/main.css',
  ],
  build: {
    transpile: ['trpc-nuxt'],
  },
  alias: {
    cookie: resolve(__dirname, 'node_modules/cookie'),
  },

  // environment variables
  runtimeConfig: {
    auth: {
      baseUrl: process.env.AUTH_ORIGIN,
      secret: process.env.NEXTAUTH_SECRET,
    },
    authCredentials: {
      // github
      githubClientId: process.env.AUTH_GITHUB_CLIENT_ID,
      githubClientSecret: process.env.AUTH_GITHUB_CLIENT_SECRET,
      // discord
      discordClientId: process.env.AUTH_DISCORD_CLIENT_ID,
      discordClientSecret: process.env.AUTH_DISCORD_CLIENT_SECRET,
      // google
      googleClientId: process.env.AUTH_GOOGLE_CLIENT_ID,
      googleClientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
      // spotify
      spotifyClientId: process.env.AUTH_SPOTIFY_CLIENT_ID,
      spotifyClientSecret: process.env.AUTH_SPOTIFY_CLIENT_SECRET,
    },
    s3: {
      bucket: process.env.S3_BUCKET,
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.S3_REGION,
      accessKey: process.env.S3_ACCESS_KEY,
      secretKey: process.env.S3_SECRET_KEY,
    },
    webhook: {
      discordUrl: process.env.WEBHOOK_DISCORD_URL,
    },
    public: {
      version: require('./package.json').version,
      environment: process.env.ENVIRONMENT,
      baseUrl: process.env.AUTH_ORIGIN,
      s3Endpoint: process.env.S3_ENDPOINT,
      s3Bucket: process.env.S3_BUCKET,
      workingTmpFolder: process.env.WORKING_TMP_FOLDER || './.tmp',
    },
  },

  // @ts-ignore
  auth: {
    origin: process.env.AUTH_ORIGIN,
    provider: {
      type: 'authjs',
    },
  },

  pwa: {
    name: 'Larminay Vault', // Same as in the manifest below: used to set the app's name for PWA behavior
    short_name: 'Larminay Vault', // Same as in the manifest below: short name for app installation
    themeColor: '#833deb', // Same as in the manifest below: theme color for the app's UI elements

    // Register service worker behavior
    registerType: 'autoUpdate', // Automatically update the service worker in the background
    workbox: {
      skipWaiting: true, // Activate the new service worker immediately
      clientsClaim: true, // Take control of the page immediately
    },

    // Icons for the PWA, which are also listed in the manifest
    icons: [
      {
        src: 'pwa-64x64.png',
        sizes: '64x64',
        type: 'image/png',
      },
      {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: 'maskable-icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],

    // The following manifest section contains the same data for proper PWA setup
    manifest: {
      name: 'Larminay Vault', // Same as pwa.name: app's name used when installing the PWA
      short_name: 'Larminay Vault', // Same as pwa.short_name: used for app's short display
      description: 'A vault for storing your important items', // Description of your app
      start_url: '/', // Defines where the app starts when opened (root URL)
      display: 'standalone', // Standalone PWA display mode (without browser UI)
      background_color: '#ffffff', // Background color of the app when loading
      theme_color: '#833deb', // Same as pwa.themeColor: affects the browser’s UI (e.g., address bar)
      icons: [
        {
          src: '/pwa-192x192.png', // Path to the icon file (192x192)
          sizes: '192x192', // Icon size
          type: 'image/png', // Image type
        },
        {
          src: '/pwa-512x512.png', // Path to the icon file (512x512)
          sizes: '512x512', // Icon size
          type: 'image/png', // Image type
        },
      ],
    },
  },

  quasar: {
    extras: {
      fontIcons: ['material-icons', 'material-symbols-outlined', 'fontawesome-v6'],
    },
    iconSet: 'material-icons-outlined',
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
      breakpoints: {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        '2xl': 1536,
      },
    },
  },
});
