import { protectedProcedure, router } from '@/server/trpc/trpc';
import dayjs from 'dayjs';

export const statsRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const items = await ctx.prisma.item.findMany({ include: { file: true } });

    const results = {
      views: 0,
      videos: {
        shortest: Infinity,
        longest: 0,
        average: 0,
        total: 0,
        count: 0,
      },
      images: {
        count: 0,
      },
      type: {} as any,
      people: {} as any,
      year: {} as any,
    };

    return results;
  }),
});

// export type definition of API
export type StatsRouter = typeof statsRouter;
