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

      const response = await ctx.prisma.comment.create({
        data: {
          itemId,
          userId: session?.id || 0,
          text,
        },
      });

      // write to logger
      const headers = Object.fromEntries(ctx.event.headers.entries());
      await logger.writeToLog({
        ip: headers['x-real-ip'] || headers['x-forwarded-for'] || headers['x-amzn-trace-id'] || '',
        route: ctx.event.context.params.trpc || '',
        method: ctx.event._method || '',
        responseSize: JSON.stringify(response).length || 0,
        requestBody: input,
        userId: session?.id || null,
        userAgent: headers['user-agent'] || '',
      });

      return response;
    }),
});

// export type definition of API
export type CommentRouter = typeof commentRouter;
