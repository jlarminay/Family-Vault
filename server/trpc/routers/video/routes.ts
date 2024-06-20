import { protectedProcedure, router } from '@/server/trpc/trpc';
import { getServerSession } from '#auth';
import { z } from 'zod';
import { searchSchema, editVideoSchema } from './schema';

export const videoRouter = router({
  search: protectedProcedure.input(searchSchema).query(async ({ input, ctx }) => {
    const session = await getServerSession(ctx.event);

    const videos = await ctx.prisma.video.findMany({
      where: {
        OR: [
          { ownerId: session?.id },
          { published: 'public' },
          {
            AND: [{ published: 'allow-few' }, { allowList: { some: { id: session?.id } } }],
          },
        ],
      },
      include: {
        video: true,
        thumbnail: true,
        likes: {
          select: {
            userId: true,
          },
        },
        persons: {
          select: {
            id: true,
            name: true,
          },
        },
        collections: {
          select: {
            id: true,
            name: true,
          },
        },
        allowList: {
          select: {
            id: true,
            name: true,
          },
        },
        blockList: {
          select: {
            id: true,
            name: true,
          },
        },
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // filter and sort videos
    return videos
      .filter((video) => {
        // search field
        if (
          input.search &&
          !(
            video.title.toLowerCase().includes(input.search.toLowerCase()) ||
            video.description?.toLowerCase().includes(input.search.toLowerCase()) ||
            video.persons.some((person) =>
              person.name.toLowerCase().includes(input.search.toLowerCase()),
            ) ||
            video.collections.some((collection) =>
              collection.name.toLowerCase().includes(input.search.toLowerCase()),
            )
          )
        ) {
          return false;
        }

        // filter by type
        if (
          input.filterBy === 'liked' &&
          !video.likes.some((like) => like.userId === session?.id)
        ) {
          return false;
        }
        if (input.filterBy === 'mine' && video.ownerId !== session?.id) {
          return false;
        }

        // filter by persons
        if (
          input.persons.length > 0 &&
          !input.persons.every((id) => video.persons.some((p) => p.id === id))
        ) {
          return false;
        }

        // filter by collections
        if (
          input.collections.length > 0 &&
          !input.collections.every((id) => video.collections.some((c) => c.id === id))
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (input.sortBy === 'title-asc') {
          return a.title.localeCompare(b.title);
        }
        if (input.sortBy === 'title-desc') {
          return b.title.localeCompare(a.title);
        }
        if (input.sortBy === 'date-taken-desc') {
          return new Date(b.dateOrder).getTime() - new Date(a.dateOrder).getTime();
        }
        if (input.sortBy === 'date-taken-asc') {
          return new Date(a.dateOrder).getTime() - new Date(b.dateOrder).getTime();
        }
        if (input.sortBy === 'date-added-asc') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }),

  getRandom: protectedProcedure
    .input(z.object({ limit: z.number() }))
    .query(async ({ ctx, input }) => {
      const session = await getServerSession(ctx.event);
      const { limit } = input;

      const videos = await ctx.prisma.video.findMany({
        where: {
          OR: [
            { ownerId: session?.id },
            { published: 'public' },
            {
              AND: [{ published: 'allow-few' }, { allowList: { some: { id: session?.id } } }],
            },
          ],
        },
        include: {
          video: true,
          thumbnail: true,
          allowList: {
            select: {
              id: true,
              name: true,
            },
          },
          blockList: {
            select: {
              id: true,
              name: true,
            },
          },
          owner: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      return videos.sort(() => Math.random() - Math.random()).slice(0, limit);
    }),

  getSingle: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const session = await getServerSession(ctx.event);

      const video = await ctx.prisma.video.findUniqueOrThrow({
        where: {
          id: input.id,
          AND: [
            // allow admin to see any video, but they must have the url
            // the videos won't show in search results
            session?.role !== 'admin'
              ? {
                  OR: [
                    { ownerId: session?.id },
                    { published: 'public' },
                    {
                      AND: [
                        { published: 'allow-few' },
                        { allowList: { some: { id: session?.id } } },
                      ],
                    },
                  ],
                }
              : {},
          ],
        },
        include: {
          persons: true,
          collections: true,
          video: true,
          thumbnail: true,
          owner: {
            select: {
              name: true,
              avatar: true,
            },
          },
          allowList: {
            select: {
              id: true,
              name: true,
            },
          },
          blockList: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      video.dateOrder = video.dateOrder.toISOString().split('T')[0] as any;

      if (!video.published && video.ownerId !== session?.id && session?.role !== 'admin') {
        throw new Error('Video not published');
      }

      return video;
    }),

  update: protectedProcedure.input(editVideoSchema).mutation(async ({ ctx, input }) => {
    const session = await getServerSession(ctx.event);

    // is user the owner
    const video = await ctx.prisma.video.findUnique({ where: { id: input.id } });
    if (video && video.ownerId !== session?.id) {
      throw new Error('Forbidden');
    }

    return await ctx.prisma.video.update({
      where: { id: input.id },
      data: {
        title: input.title,
        description: input.description,
        dateDisplay: input.dateDisplay,
        dateOrder: input.dateOrder,
        originalFormat: input.originalFormat,

        persons: {
          set: input.persons?.map((person) => ({ id: person })) || [],
        },
        collections: {
          set: input.collections?.map((collection) => ({ id: collection })) || [],
        },

        published: input.published,
        allowList: {
          set: input.allowList?.map((user) => ({ id: user })) || [],
        },
      },
    });
  }),
});

// export type definition of API
export type VideoRouter = typeof videoRouter;
