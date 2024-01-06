import { protectedProcedure, router } from '@/server/trpc/trpc';
import { z } from 'zod';

export const commentRouter = router({
  getForVideo: protectedProcedure
    .input(z.object({ videoId: z.number() }))
    .query(async ({ ctx, input }) => {
      const { videoId } = input;
      return await ctx.prisma.comment.findMany({
        where: { videoId },
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, avatar: true },
          },
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        videoId: z.number(),
        userId: z.number(),
        text: z.string().max(256),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { videoId, userId, text } = input;
      return await ctx.prisma.comment.create({
        data: {
          videoId,
          userId,
          text,
        },
      });
    }),
});

// export type definition of API
export type CommentRouter = typeof commentRouter;
