import { createNuxtApiHandler } from 'trpc-nuxt';
import { appRouter } from '@/server/trpc/routers';
import pkg from '@prisma/client';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// export API handler
export default createNuxtApiHandler({
  router: appRouter as any,
  createContext: (event) => {
    return {
      prisma,
      event,
    };
  },
});
