import { publicProcedure, router } from '@/server/trpc/trpc';
import { z } from 'zod';

export const videoRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.video.findMany();
  }),
  getSingle: publicProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    const { id } = input;
    return await ctx.prisma.video.findUniqueOrThrow({
      where: { id },
    });
  }),
});

// export type definition of API
export type VideoRouter = typeof videoRouter;
