import { publicProcedure, router } from '@/server/trpc/trpc';
import { z } from 'zod';

export const videoRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.video.findMany();
  }),
});

// export type definition of API
export type VideoRouter = typeof videoRouter;
