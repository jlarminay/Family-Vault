import { protectedProcedure, router } from '@/server/trpc/trpc';
import { getServerSession } from '#auth';
import { z } from 'zod';
import { searchSchema, uploadVideoSchema, processVideoSchema, editVideoSchema } from './schema';
import fs from 'fs';
import VideoProcessor from '@/server/utils/videoProcessor.js';
import S3 from '@/server/utils/s3.js';

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
    const session = await getServerSession(ctx.event);
    const { key, packets, name } = input;
    const targetDir = process.env.WORKING_TMP_FOLDER || './.tmp';

    let cleanedName = name.replace(/\s+/g, '-').toLowerCase();
    let fileLocation: string = `${targetDir}/${key}_${cleanedName}`;
    let videoData: any = {};

    try {
      // convert data back into video file
      try {
        let allBuffers: any = [];

        // check that file is ready to be read
        for (let i = 1; i <= packets; i++) {
          const file = `${targetDir}/${key}.${i}.tmp`;

          let ready = false;
          let retries = 0;
          let maxRetries = 10;
          while (!ready && retries < maxRetries) {
            try {
              fs.readFileSync(file);
              ready = true;
            } catch (e) {
              retries++;
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          }
          if (!ready) throw new Error('File not ready');

          const string = fs.readFileSync(file).toString();
          const buffer = Buffer.from(string, 'base64');
          allBuffers.push(buffer);
          fs.unlinkSync(file);
        }

        const combinedStrings = Buffer.concat(allBuffers);
        fs.writeFileSync(fileLocation, combinedStrings);

        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (e) {
        console.log('failed to combine packets', key, packets, cleanedName, e);
        return false;
      }

      // get metadata
      try {
        const processing = new VideoProcessor(fileLocation);
        videoData = await processing.prepareNewVideo();
      } catch (e) {
        console.log('failed to process video', key, packets, cleanedName, e);
        return false;
      }

      // upload to s3
      try {
        const s3 = new S3();
        await s3.upload({
          key: `videos/${videoData.randomString}_${videoData.video.name}`,
          filePath: `${targetDir}/${videoData.video.name}`,
        });
        await s3.upload({
          key: `videos/${videoData.randomString}_${videoData.thumbnail.name}`,
          filePath: `${targetDir}/${videoData.thumbnail.name}`,
        });
      } catch (e) {
        console.log('failed to upload to s3', key, packets, name, e);
        return false;
      }

      // insert into db
      try {
        const dbVideo = await ctx.prisma.file.create({ data: { ...videoData.video, name } });
        const dbThumbnail = await ctx.prisma.file.create({
          data: { ...videoData.thumbnail, name },
        });
        return ctx.prisma.video.create({
          data: {
            title: name,
            description: '',
            ownerId: session?.id || 0,
            videoId: dbVideo.id,
            thumbnailId: dbThumbnail.id,
            dateDisplay: '',
            dateOrder: new Date(),
            published: 'private',
          },
        });
      } catch (e) {
        console.log('failed to insert into db', key, name, e);
        return false;
      }
    } catch (e) {
      console.log('failed to process video', key, name, e);
      return false;
    }
  }),
});

// export type definition of API
export type VideoRouter = typeof videoRouter;
