import { protectedProcedure, router } from '@/server/trpc/trpc';
import { getServerSession } from '#auth';
import { z } from 'zod';
import { uploadVideoSchema, processVideoSchema } from './schema';
import fs from 'fs';
import VideoProcessor from '@/server/utils/videoProcessor.js';
import S3 from '@/server/utils/s3.js';

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

  uploadVideo: protectedProcedure.input(uploadVideoSchema).mutation(async ({ ctx, input }) => {
    const { key, count, packet } = input;

    try {
      // create folder if not exists
      if (!fs.existsSync('./.tmp')) {
        fs.mkdirSync('./.tmp');
      }

      // append packet to file
      fs.writeFileSync(`./.tmp/${key}.${count}.tmp`, packet);

      return true;
    } catch (e) {
      return false;
    }
  }),
  processVideo: protectedProcedure.input(processVideoSchema).mutation(async ({ ctx, input }) => {
    const session = await getServerSession(ctx.event);
    const { key, packets, name } = input;

    let fileLocation: string = `./.tmp/${key}_${name}`;
    let videoData: any = {};

    // convert data back into video file
    {
      let allBuffers: any = [];

      // check that file is ready to be read
      for (let i = 1; i <= packets; i++) {
        const file = `./.tmp/${key}.${i}.tmp`;

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
    }

    // get metadata
    {
      const processing = new VideoProcessor(fileLocation);
      videoData = await processing.prepareNewVideo();
    }

    // upload to s3
    {
      const s3 = new S3();
      await s3.upload({
        key: `videos/${videoData.randomString}_${videoData.video.name}`,
        filePath: './.tmp/' + videoData.video.name,
      });
      await s3.upload({
        key: `videos/${videoData.randomString}_${videoData.thumbnail.name}`,
        filePath: './.tmp/' + videoData.thumbnail.name,
      });
    }

    // insert into db
    {
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
          published: false,
        },
      });
    }
  }),
});

// export type definition of API
export type VideoRouter = typeof videoRouter;
