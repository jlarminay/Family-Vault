import { NuxtAuthHandler } from '#auth';
import authCallbacks from '@/server/utils/authCallbacks';

import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import DiscordProvider from 'next-auth/providers/discord';
import GoogleProvider from 'next-auth/providers/google';
import isOnTestingServer from '~/utils/isOnTestingServer';

// all provider info can be found here
// https://authjs.dev/getting-started/providers

export default NuxtAuthHandler({
  secret: useRuntimeConfig().auth.secret,
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    // this bypassed the login page and sets the user to the test user
    // used for e2e tests
    isOnTestingServer()
      ? // @ts-expect-error
        CredentialsProvider.default({
          name: 'credentials',
          credentials: {
            username: { label: 'Username', type: 'text' },
            password: { label: 'Password', type: 'password' },
          },
          async authorize(credentials: any, req: any) {
            return { id: 1, name: 'test', email: 'test@email.com' };
          },
        })
      : {},

    // @ts-expect-error
    GithubProvider.default({
      // http://localhost:3000/api/auth/callback/github
      clientId: useRuntimeConfig().authCredentials.githubClientId,
      clientSecret: useRuntimeConfig().authCredentials.githubClientSecret,
    }),

    // @ts-expect-error
    DiscordProvider.default({
      // http://localhost:3000/api/auth/callback/discord
      clientId: useRuntimeConfig().authCredentials.discordClientId,
      clientSecret: useRuntimeConfig().authCredentials.discordClientSecret,
    }),

    // @ts-expect-error
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
