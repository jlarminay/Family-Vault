import { protectedProcedure, router } from '@/server/trpc/trpc';

export const locationRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.location.findMany();
  }),
});

// export type definition of API
export type LikeRouter = typeof locationRouter;
