import { protectedProcedure, adminProcedure, router } from '@/server/trpc/trpc';
import { getServerSession } from '#auth';
import { z } from 'zod';
import webhooks from '@/server/utils/webhooks';

export const reportRouter = router({
  create: protectedProcedure
    .input(z.object({ itemId: z.number(), report: z.string().max(256) }))
    .mutation(async ({ ctx, input }) => {
      const session = await getServerSession(ctx.event);
      const { itemId, report } = input;

      // insert into db
      const response = await ctx.prisma.report.create({
        data: {
          itemId,
          userId: session?.id || 0,
          report,
        },
      });
      // send webhook
      const item = await ctx.prisma.item.findUnique({ where: { id: itemId } });
      webhooks.discord({ item, user: session, report });
      // return response
      return response;
    }),
});

// export type definition of API
export type ReportRouter = typeof reportRouter;
