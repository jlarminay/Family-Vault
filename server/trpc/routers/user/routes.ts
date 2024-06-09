import { protectedProcedure, router } from '@/server/trpc/trpc';

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
});

// export type definition of API
export type UserRouter = typeof userRouter;
