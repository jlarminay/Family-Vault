import { router } from '@/server/trpc/trpc';

import { videoRouter } from './video/routes';
import { commentRouter } from './comment/routes';
import { personRouter } from './person/routes';
import { likeRouter } from './like/routes';

export const appRouter = router({
  video: videoRouter,
  comment: commentRouter,
  person: personRouter,
  like: likeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
