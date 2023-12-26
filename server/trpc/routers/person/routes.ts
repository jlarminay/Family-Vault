import { publicProcedure, router } from '@/server/trpc/trpc';
import { z } from 'zod';

export const personRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const results = await ctx.prisma.person.findMany({ include: { videos: true } });
    return results.map((result) => ({
      ...result,
      videos: result.videos?.length || 0,
    }));
  }),
  getSingle: publicProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    const { id } = input;
    return await ctx.prisma.person.findUniqueOrThrow({
      where: { id },
      include: { videos: true },
    });
  }),
});

// export type definition of API
export type PersonRouter = typeof personRouter;
