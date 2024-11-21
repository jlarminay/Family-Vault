import { NuxtAuthHandler } from '#auth';
import { PrismaClient } from '@prisma/client';
import authCallbacks from '@/server/utils/authCallbacks';

import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import DiscordProvider from 'next-auth/providers/discord';
import GoogleProvider from 'next-auth/providers/google';
import SpotifyProvider from 'next-auth/providers/spotify';
import isOnTestingServer from '~/utils/isOnTestingServer';

// all provider info can be found here
// https://authjs.dev/getting-started/providers

const prisma = new PrismaClient();

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
          async authorize(credentials: any, _req: any) {
            if (!credentials.email || !credentials.password) {
              return null;
            }

            const user = await prisma.user.findUniqueOrThrow({
              where: {
                email: credentials.email,
                provider: 'credentials',
              },
            });

            // check password
            // password is hardcoded because this can only work on a testing server
            // and the user with the provider of 'credentials' must exist in the db
            // so for this to work at all, they must have access to either an admin account
            // and/or the db itself
            if (credentials.password !== 'Password1') {
              return null;
            }

            return user;
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

    // @ts-expect-error
    SpotifyProvider.default({
      // http://localhost:3000/api/auth/callback/spotify
      clientId: useRuntimeConfig().authCredentials.spotifyClientId,
      clientSecret: useRuntimeConfig().authCredentials.spotifyClientSecret,
    }),
  ],

  callbacks: authCallbacks as any,
});
