import { NuxtAuthHandler } from '#auth';
import GithubProvider from 'next-auth/providers/github';
import DiscordProvider from 'next-auth/providers/discord';
import GoogleProvider from 'next-auth/providers/google';
import authCallbacks from '@/server/utils/authCallbacks';

// all provider info can be found here
// https://authjs.dev/getting-started/providers

export default NuxtAuthHandler({
  secret: useRuntimeConfig().auth.secret,
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    GithubProvider.default({
      // http://localhost:3000/api/auth/callback/github
      clientId: useRuntimeConfig().authCredentials.githubClientId,
      clientSecret: useRuntimeConfig().authCredentials.githubClientSecret,
    }),

    // @ts-expect-error You need to use .default here for it to work during SSR
    DiscordProvider.default({
      // http://localhost:3000/api/auth/callback/discord
      clientId: useRuntimeConfig().authCredentials.discordClientId,
      clientSecret: useRuntimeConfig().authCredentials.discordClientSecret,
    }),

    // @ts-expect-error You need to use .default here for it to work during SSR
    GoogleProvider.default({
      // http://localhost:3000/api/auth/callback/google
      clientId: useRuntimeConfig().authCredentials.googleClientId,
      clientSecret: useRuntimeConfig().authCredentials.googleClientSecret,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],

  callbacks: authCallbacks as any,
});
