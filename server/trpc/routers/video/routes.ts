import { protectedProcedure, router } from '@/server/trpc/trpc';
import { getServerSession } from '#auth';
import { z } from 'zod';

export const videoRouter = router({
  getAllPublic: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.video.findMany({
      where: { published: true },
      include: { video: true, thumbnail: true },
      orderBy: { createdAt: 'desc' },
    });
  }),
  getAllLiked: protectedProcedure.query(async ({ ctx }) => {
    const session = await getServerSession(ctx.event);

    return await ctx.prisma.video.findMany({
      where: { published: true, likes: { some: { userId: session?.id } } },
      include: { video: true, thumbnail: true },
    });
  }),
  getAllMine: protectedProcedure.query(async ({ ctx }) => {
    const session = await getServerSession(ctx.event);

    return await ctx.prisma.video.findMany({
      where: { ownerId: session?.id },
      include: { video: true, thumbnail: true },
    });
  }),

  getRandom: protectedProcedure
    .input(z.object({ limit: z.number() }))
    .query(async ({ ctx, input }) => {
      const session = await getServerSession(ctx.event);
      const { limit } = input;

      const videos = await ctx.prisma.video.findMany({
        where: { published: true },
        include: { video: true, thumbnail: true },
      });
      return videos.sort(() => Math.random() - Math.random()).slice(0, limit);
    }),

  getSingle: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const session = await getServerSession(ctx.event);
      const { id } = input;

      const video = await ctx.prisma.video.findUniqueOrThrow({
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

      if (!video.published && video.ownerId !== session?.id) {
        throw new Error('Video not published');
      }

      return video;
    }),
});

// export type definition of API
export type VideoRouter = typeof videoRouter;
