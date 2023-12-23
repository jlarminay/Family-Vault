import { publicProcedure, router } from '@/server/trpc/trpc';
import { z } from 'zod';

export const videoRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.video.findMany();
  }),
  getRandom: publicProcedure
    .input(z.object({ limit: z.number() }))
    .query(async ({ ctx, input }) => {
      const { limit } = input;
      const videos = await ctx.prisma.video.findMany();
      return videos.sort(() => Math.random() - Math.random()).slice(0, limit);
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
