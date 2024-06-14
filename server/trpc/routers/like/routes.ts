import { protectedProcedure, router } from '@/server/trpc/trpc';
import { getServerSession } from '#auth';
import { z } from 'zod';

export const likeRouter = router({
  getForVideo: protectedProcedure
    .input(z.object({ videoId: z.number() }))
    .query(async ({ ctx, input }) => {
      const session = await getServerSession(ctx.event);
      const { videoId } = input;

      return {
        count: await ctx.prisma.like.count({ where: { videoId } }),
        isLiked: (await ctx.prisma.like.count({ where: { videoId, userId: session?.id } })) > 0,
      };
    }),

  getAllMine: protectedProcedure.query(async ({ ctx }) => {
    const session = await getServerSession(ctx.event);

    return await ctx.prisma.like.findMany({
      where: { userId: session?.id },
      include: { video: true },
    });
  }),

  update: protectedProcedure
    .input(z.object({ videoId: z.number(), liked: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const session = await getServerSession(ctx.event);
      const { videoId, liked } = input;

      if (liked) {
        await ctx.prisma.like.create({
          data: {
            userId: session?.id || 0,
            videoId,
          },
        });
        return true; // to show liked
      } else {
        await ctx.prisma.like.delete({
          where: {
            userId_videoId: {
              userId: session?.id || 0,
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
