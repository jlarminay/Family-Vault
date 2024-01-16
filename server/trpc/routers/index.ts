import { router } from '@/server/trpc/trpc';

import { videoRouter } from './video/routes';
import { commentRouter } from './comment/routes';
import { personRouter } from './person/routes';
import { likeRouter } from './like/routes';
import { reportRouter } from './report/routes';
import { userRouter } from './user/routes';

export const appRouter = router({
  video: videoRouter,
  comment: commentRouter,
  person: personRouter,
  like: likeRouter,
  report: reportRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
