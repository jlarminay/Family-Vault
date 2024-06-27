import { protectedProcedure, router } from '@/server/trpc/trpc';
import { getServerSession } from '#auth';
import { editOwnUserSchema } from './schema';

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

    return await ctx.prisma.history.findMany({
      where: {
        userId: session?.id,
      },
      include: {
        video: {
          include: {
            thumbnail: true,
            video: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 12,
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
