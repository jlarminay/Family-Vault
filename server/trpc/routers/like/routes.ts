import { protectedProcedure, router } from '@/server/trpc/trpc';
import { getServerSession } from '#auth';
import { z } from 'zod';

export const likeRouter = router({
  getForVideo: protectedProcedure
    .input(z.object({ itemId: z.number() }))
    .query(async ({ ctx, input }) => {
      const session = await getServerSession(ctx.event);
      const { itemId } = input;

      return {
        count: await ctx.prisma.like.count({ where: { itemId } }),
        isLiked: (await ctx.prisma.like.count({ where: { itemId, userId: session?.id } })) > 0,
      };
    }),

  getAllMine: protectedProcedure.query(async ({ ctx }) => {
    const session = await getServerSession(ctx.event);

    return await ctx.prisma.like.findMany({
      where: { userId: session?.id },
      include: {
        item: {
          select: { id: true, type: true, name: true, path: true },
        },
      },
    });
  }),

  update: protectedProcedure
    .input(z.object({ itemId: z.number(), liked: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const session = await getServerSession(ctx.event);
      const { itemId, liked } = input;

      if (liked) {
        await ctx.prisma.like.create({
          data: {
            userId: session?.id || 0,
            itemId,
          },
        });
        return true; // to show liked
      } else {
        await ctx.prisma.like.delete({
          where: {
            userId_itemId: {
              userId: session?.id || 0,
              itemId,
            },
          },
        });
        return false; // to show not liked
      }
    }),
});

// export type definition of API
export type LikeRouter = typeof likeRouter;
