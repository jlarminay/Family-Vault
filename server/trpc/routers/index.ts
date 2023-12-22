import { router } from '@/server/trpc/trpc';
import { testRouter } from './test/routes';

export const appRouter = router({
  test: testRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
