import { protectedProcedure, router } from '@/server/trpc/trpc';
import { getServerSession } from '#auth';
import { z } from 'zod';

export const videoRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const session = await getServerSession(ctx.event);
    if (!session) throw new Error('No session found');
    return await ctx.prisma.video.findMany({
      where: { OR: [{ ownerId: session.id }, { published: true }] },
      include: { video: true, thumbnail: true },
    });
  }),

  getRandom: protectedProcedure
    .input(z.object({ limit: z.number() }))
    .query(async ({ ctx, input }) => {
      const { limit } = input;
      const videos = await ctx.prisma.video.findMany({ include: { video: true, thumbnail: true } });
      return videos.sort(() => Math.random() - Math.random()).slice(0, limit);
    }),

  getSingle: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      return await ctx.prisma.video.findUniqueOrThrow({
        where: { id },
        include: {
          persons: true,
          video: true,
          thumbnail: true,
          owner: {
            select: {
              name: true,
              avatar: true,
            },
          },
        },
      });
    }),

  getLiked: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ ctx, input }) => {
      const { userId } = input;
      const likes = await ctx.prisma.like.findMany({
        where: { userId },
        include: { video: { include: { video: true, thumbnail: true } } },
        orderBy: { createdAt: 'desc' },
      });
      return likes.map((like) => {
        return like.video;
      });
    }),
});

// export type definition of API
export type VideoRouter = typeof videoRouter;
