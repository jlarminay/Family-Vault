import { protectedProcedure, router } from '@/server/trpc/trpc';
import { getServerSession } from '#auth';
import { z } from 'zod';
import { searchSchema, uploadVideoSchema, processVideoSchema, editVideoSchema } from './schema';
import fs from 'fs';
import queue from '@/server/utils/queue';

export const videoRouter = router({
  search: protectedProcedure.input(searchSchema).query(async ({ input, ctx }) => {
    const session = await getServerSession(ctx.event);

    // search rules
    const searchRules = input.search
      ? { OR: [{ title: { contains: input.search } }, { description: { contains: input.search } }] }
      : {};

    // filter rules
    let filterRules;
    switch (input.filterBy) {
      case 'liked':
        filterRules = {
          AND: [{ likes: { some: { userId: session?.id } } }],
        };
        break;
      case 'mine':
        filterRules = { ownerId: session?.id };
        break;
      case 'all':
      default:
        filterRules = {};
        break;
    }

    // sort rules
    let sortRules;
    switch (input.sortBy) {
      case 'title-asc':
        sortRules = { title: 'asc' };
        break;
      case 'title-desc':
        sortRules = { title: 'desc' };
        break;
      case 'date-taken-desc':
        sortRules = { dateOrder: 'desc' };
        break;
      case 'date-added-asc':
        sortRules = { createdAt: 'asc' };
        break;
      case 'date-taken-asc':
        sortRules = { dateOrder: 'asc' };
        break;
      case 'date-added-desc':
      default:
        sortRules = { createdAt: 'desc' };
        break;
    }

    // sort persons
    let personsRules =
      input.persons.length > 0 ? { persons: { some: { id: { in: input.persons } } } } : {};

    // sort collections
    let collectionsRules =
      input.collections.length > 0
        ? { collections: { some: { id: { in: input.collections } } } }
        : {};

    const videos = await ctx.prisma.video.findMany({
      where: {
        AND: [
          filterRules,
          searchRules,
          personsRules,
          collectionsRules,
          {
            OR: [
              { ownerId: session?.id },
              { published: 'public' },
              {
                AND: [{ published: 'allow-few' }, { allowList: { some: { id: session?.id } } }],
              },
            ],
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
      // @ts-ignore
      orderBy: sortRules,
    });

    return videos;
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

  uploadVideo: protectedProcedure.input(uploadVideoSchema).mutation(async ({ ctx, input }) => {
    const { key, count, packet } = input;
    const targetDir = process.env.WORKING_TMP_FOLDER || './.tmp';

    if (count === 1) {
      console.log('uploading video', key, targetDir);
    }

    try {
      // create folder if not exists
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir);
      }

      // append packet to file
      fs.writeFileSync(`${targetDir}/${key}.${count}.tmp`, packet);
      return true;
    } catch (e) {
      console.log('failed to upload packet', key, count, e);
      return false;
    }
  }),
  processVideo: protectedProcedure.input(processVideoSchema).mutation(async ({ ctx, input }) => {
    const { key, packets, name } = input;
    const session = await getServerSession(ctx.event);
    const targetDir = process.env.WORKING_TMP_FOLDER || './.tmp';

    const newVideo = await ctx.prisma.video.create({
      data: {
        title: name,
        description: '',
        ownerId: session?.id || 0,
        dateDisplay: '',
        dateOrder: new Date(),
        published: 'private',
        status: 'processing',
      },
    });

    queue.push({
      videoId: newVideo.id,
      key,
      packets,
      name,
      targetDir,
      session,
      prisma: ctx.prisma,
    });
    return false;
  }),
});

// export type definition of API
export type VideoRouter = typeof videoRouter;
