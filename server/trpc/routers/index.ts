import { router } from '@/server/trpc/trpc';

import { testRouter } from './test/routes';
import { videoRouter } from './video/routes';

export const appRouter = router({
  test: testRouter,
  video: videoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
