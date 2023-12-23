import { createNuxtApiHandler } from 'trpc-nuxt';
import { appRouter } from '@/server/trpc/routers';
import { createContext } from '@/server/trpc/context';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// export API handler
export default createNuxtApiHandler({
  router: appRouter as any,
  createContext: () => {
    return {
      prisma,
    };
  },
});
