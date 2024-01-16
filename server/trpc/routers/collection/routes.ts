import { protectedProcedure, router } from '@/server/trpc/trpc';
import { getServerSession } from '#auth';
import { createCollectionSchema, editCollectionSchema } from './schema';
import { z } from 'zod';

export const collectionRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const session = await getServerSession(ctx.event);
    return await ctx.prisma.collection.findMany({ include: { videos: true } });
  }),
  getSingle: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      return await ctx.prisma.collection.findUniqueOrThrow({
        where: { id },
        include: {
          videos: { include: { video: true, thumbnail: true } },
        },
      });
    }),

  create: protectedProcedure.input(createCollectionSchema).mutation(async ({ ctx, input }) => {
    const { name, description } = input;
    return await ctx.prisma.collection.create({
      data: { name, description },
    });
  }),
  update: protectedProcedure.input(editCollectionSchema).mutation(async ({ ctx, input }) => {
    const { id, name, description } = input;
    return await ctx.prisma.collection.update({
      where: { id },
      data: { name, description },
    });
  }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      return await ctx.prisma.collection.delete({
        where: { id },
      });
    }),
});

// export type definition of API
export type CollectionRouter = typeof collectionRouter;
