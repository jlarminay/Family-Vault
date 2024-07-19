import { protectedProcedure, router } from '@/server/trpc/trpc';
import { getServerSession } from '#auth';
import { editOwnUserSchema } from './schema';
import dayjs from 'dayjs';

export const userRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        active: true,
      },
    });
  }),

  getHistory: protectedProcedure.query(async ({ ctx }) => {
    const session = await getServerSession(ctx.event);

    const history = await ctx.prisma.history.findMany({
      where: {
        userId: session?.id,
      },
      include: {
        item: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 12,
    });

    return history.map((historyItem) => {
      const item = historyItem.item;
      return {
        ...item,
        takenAt: dayjs(item.takenAt).format('YYYY-MM-DD') as string,
        createdAt: dayjs(item.createdAt).format('YYYY-MM-DD') as string,
      };
    });
  }),

  updateOwn: protectedProcedure.input(editOwnUserSchema).mutation(async ({ ctx, input }) => {
    const session = await getServerSession(ctx.event);

    if (session?.id !== input.id) {
      throw new Error('User can only update their own profile');
    }

    return await ctx.prisma.user.update({
      where: {
        id: input.id,
      },
      data: {
        name: input.name,
      },
    });
  }),
});

// export type definition of API
export type UserRouter = typeof userRouter;
