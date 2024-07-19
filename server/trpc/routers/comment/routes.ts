import { protectedProcedure, router } from '@/server/trpc/trpc';
import { getServerSession } from '#auth';
import { z } from 'zod';

export const commentRouter = router({
  getForVideo: protectedProcedure
    .input(z.object({ itemId: z.number() }))
    .query(async ({ ctx, input }) => {
      const { itemId } = input;

      return await ctx.prisma.comment.findMany({
        where: { itemId },
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, avatar: true },
          },
        },
      });
    }),

  createForVideo: protectedProcedure
    .input(
      z.object({
        itemId: z.number(),
        text: z.string().max(256),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const session = await getServerSession(ctx.event);
      const { itemId, text } = input;

      return await ctx.prisma.comment.create({
        data: {
          itemId,
          userId: session?.id || 0,
          text,
        },
      });
    }),
});

// export type definition of API
export type CommentRouter = typeof commentRouter;
