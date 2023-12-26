import { publicProcedure, router } from '@/server/trpc/trpc';
import { z } from 'zod';

export const likeRouter = router({
  getVideoCount: publicProcedure
    .input(z.object({ videoId: z.number() }))
    .query(async ({ ctx, input }) => {
      const { videoId } = input;
      return await ctx.prisma.like.count({ where: { videoId } });
    }),
  isVideoLiked: publicProcedure
    .input(z.object({ videoId: z.number(), userId: z.number() }))
    .query(async ({ ctx, input }) => {
      const { videoId, userId } = input;
      return (await ctx.prisma.like.count({ where: { videoId, userId } })) > 0;
    }),
  update: publicProcedure
    .input(z.object({ userId: z.number(), videoId: z.number(), like: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const { userId, videoId, like } = input;
      if (like) {
        await ctx.prisma.like.create({
          data: {
            userId,
            videoId,
          },
        });
        return true; // to show liked
      } else {
        await ctx.prisma.like.delete({
          where: {
            userId_videoId: {
              userId,
              videoId,
            },
          },
        });
        return false; // to show not liked
      }
    }),
});

// export type definition of API
export type LikeRouter = typeof likeRouter;
