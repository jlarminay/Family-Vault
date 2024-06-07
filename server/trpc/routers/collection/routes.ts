import { adminProcedure, protectedProcedure, router } from '@/server/trpc/trpc';
import { getServerSession } from '#auth';
import { createCollectionSchema, editCollectionSchema } from './schema';
import { z } from 'zod';

export const collectionRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const collections = await ctx.prisma.collection.findMany({ include: { videos: true } });
    return collections.map((c) => ({
      ...c,
      videos: c.videos.length,
    }));
  }),
  getSingle: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const collection = await ctx.prisma.collection.findUniqueOrThrow({
        where: {
          id: input.id,
        },
        include: {
          videos: { include: { video: true, thumbnail: true } },
        },
      });

      return {
        ...collection,
        videos: collection.videos.filter((v) => v.published),
      };
    }),
});

// export type definition of API
export type CollectionRouter = typeof collectionRouter;
