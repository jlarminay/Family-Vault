import { NuxtAuthHandler } from '#auth';
import GithubProvider from 'next-auth/providers/github';
import DiscordProvider from 'next-auth/providers/discord';
import authCallbacks from '@/server/utils/authCallbacks';

export default NuxtAuthHandler({
  secret: useRuntimeConfig().auth.secret,
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    GithubProvider.default({
      // http://localhost:3000/api/auth/callback/github
      clientId: useRuntimeConfig().github.clientId,
      clientSecret: useRuntimeConfig().github.clientSecret,
    }),
    // @ts-expect-error You need to use .default here for it to work during SSR
    DiscordProvider.default({
      // http://localhost:3000/api/auth/callback/discord
      clientId: useRuntimeConfig().discord.clientId,
      clientSecret: useRuntimeConfig().discord.clientSecret,
    }),
  ],
  callbacks: authCallbacks as any,
});
