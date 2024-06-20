import { router } from '@/server/trpc/trpc';

import { adminRouter } from './admin/routes';
import { settingRouter } from './setting/routes';
import { videoRouter } from './video/routes';
import { commentRouter } from './comment/routes';
import { likeRouter } from './like/routes';
import { reportRouter } from './report/routes';
import { userRouter } from './user/routes';

export const appRouter = router({
  admin: adminRouter,
  setting: settingRouter,
  video: videoRouter,
  comment: commentRouter,
  like: likeRouter,
  report: reportRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
