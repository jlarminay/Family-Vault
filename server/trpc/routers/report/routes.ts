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
      // webhooks.discord({ item, user: session, report });

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

      // return response
      return response;
    }),
});

// export type definition of API
export type ReportRouter = typeof reportRouter;
