import { adminProcedure, router } from '@/server/trpc/trpc';
import { z } from 'zod';
import { getServerSession } from '#auth';
import adminFunctions from './functions';

export const adminRouter = router({
  // item (R)
  ...{
    itemRead: adminProcedure.query(async ({ ctx }) => {
      return await ctx.prisma.item.findMany({
        include: { owner: true },
      });
    }),
  },

  // user (CRU)
  ...{
    userCreate: adminProcedure
      .input(
        z.object({
          name: z.string().max(64),
          email: z.string().max(128),
          provider: z.string(z.enum(['github', 'discord', 'google', 'spotify'])),
          role: z.string(z.enum(['admin', 'user'])),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const session = await getServerSession(ctx.event);
        const response = await ctx.prisma.user.create({
          data: {
            name: input.name,
            email: input.email,
            provider: input.provider,
            role: input.role,
          },
        });

        // write to logger
        const headers = Object.fromEntries(ctx.event.headers.entries());
        await logger.writeToLog({
          ip:
            headers['x-real-ip'] || headers['x-forwarded-for'] || headers['x-amzn-trace-id'] || '',
          route: ctx.event.context.params.trpc || '',
          method: ctx.event._method || '',
          responseSize: JSON.stringify(response).length || 0,
          requestBody: input,
          userId: session?.id || null,
          userAgent: headers['user-agent'] || '',
        });

        return response;
      }),
    userRead: adminProcedure.query(async ({ ctx }) => {
      return await ctx.prisma.user.findMany();
    }),
    userUpdate: adminProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().max(64),
          email: z.string().max(128),
          provider: z.string(z.enum(['github', 'discord', 'google', 'spotify'])),
          role: z.string(z.enum(['admin', 'user'])),
          active: z.boolean(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const session = await getServerSession(ctx.event);
        const response = await ctx.prisma.user.update({
          where: { id: input.id },
          data: {
            name: input.name,
            email: input.email,
            provider: input.provider,
            role: input.role,
            active: input.active,
          },
        });

        // write to logger
        const headers = Object.fromEntries(ctx.event.headers.entries());
        await logger.writeToLog({
          ip:
            headers['x-real-ip'] || headers['x-forwarded-for'] || headers['x-amzn-trace-id'] || '',
          route: ctx.event.context.params.trpc || '',
          method: ctx.event._method || '',
          responseSize: JSON.stringify(response).length || 0,
          requestBody: input,
          userId: session?.id || null,
          userAgent: headers['user-agent'] || '',
        });

        return response;
      }),
  },

  // system logs (R)
  ...{
    systemLogRead: adminProcedure.query(async ({ ctx }) => {
      return await ctx.prisma.systemLog.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 200, // only return last 200 items
      });
    }),
  },

  // custom admin functions
  ...adminFunctions,
});

// export type definition of API
export type AdminRouter = typeof adminRouter;
