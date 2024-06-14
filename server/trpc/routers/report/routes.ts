import { protectedProcedure, adminProcedure, router } from '@/server/trpc/trpc';
import { getServerSession } from '#auth';
import { z } from 'zod';
import webhooks from '@/server/utils/webhooks';

export const reportRouter = router({
  create: protectedProcedure
    .input(z.object({ videoId: z.number(), report: z.string().max(256) }))
    .mutation(async ({ ctx, input }) => {
      const session = await getServerSession(ctx.event);
      const { videoId, report } = input;

      // insert into db
      const response = await ctx.prisma.report.create({
        data: {
          videoId,
          userId: session?.id || 0,
          report,
        },
      });
      // send webhook
      const video = await ctx.prisma.video.findUnique({ where: { id: videoId } });
      webhooks.discord({ video, user: session, report });
      // return response
      return response;
    }),
});

// export type definition of API
export type ReportRouter = typeof reportRouter;
