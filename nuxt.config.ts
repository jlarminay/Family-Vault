import { fileURLToPath } from 'url';

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', 'nuxt-quasar-ui'],
  build: {
    transpile: ['trpc-nuxt'],
  },
  runtimeConfig: {
    // public
    public: {},

    // private
  },
});
