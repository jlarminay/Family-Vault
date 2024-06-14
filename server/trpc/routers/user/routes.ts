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
