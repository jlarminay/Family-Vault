import { protectedProcedure, router } from '@/server/trpc/trpc';
import { z } from 'zod';
import webhooks from '@/server/utils/webhooks';

export const reportRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.report.findMany({ include: { user: true, video: true } });
  }),
  create: protectedProcedure
    .input(z.object({ videoId: z.number(), userId: z.number(), report: z.string().max(256) }))
    .mutation(async ({ ctx, input }) => {
      const { videoId, userId, report } = input;
      // insert into db
      const response = await ctx.prisma.report.create({
        data: {
          videoId,
          userId,
          report,
        },
      });
      // send webhook
      const video = await ctx.prisma.video.findUnique({ where: { id: videoId } });
      const user = await ctx.prisma.user.findUnique({ where: { id: userId } });
      webhooks.discord({ video, user, report });
      // return response
      return response;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      return await ctx.prisma.report.delete({ where: { id } });
    }),
});

// export type definition of API
export type LikeRouter = typeof reportRouter;
