import { publicProcedure, router } from '@/server/trpc/trpc';
import { z } from 'zod';

export const userRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany();
  }),
  getSingle: publicProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    const { id } = input;
    return await ctx.prisma.user.findUniqueOrThrow({
      where: { id },
    });
  }),
});

// export type definition of API
export type UserRouter = typeof userRouter;
