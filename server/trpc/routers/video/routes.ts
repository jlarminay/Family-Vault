import { protectedProcedure, router } from '@/server/trpc/trpc';
import { getServerSession } from '#auth';
import { z } from 'zod';
import { uploadVideoSchema } from './schema';
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
    const session = await getServerSession(ctx.event);
    const { key, name, count, final, packet } = input;

    // create folder if not exists
    if (!fs.existsSync('./.tmp')) {
      fs.mkdirSync('./.tmp');
    }

    // append packet to file
    fs.writeFileSync(`./.tmp/${key}.${count}.tmp`, packet);

    // if not final packet, return
    if (!final) return true;
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let fileLocation: string = '';
    let videoData: any = {};

    // convert data back into video file
    {
      let allPackets = '';
      fs.readdirSync('./.tmp').forEach((file) => {
        if (!file.includes(key)) return;

        allPackets += fs.readFileSync(`./.tmp/${file}`);
        fs.unlinkSync(`./.tmp/${file}`);
      });
      const buffer = Buffer.from(allPackets, 'base64');
      fileLocation = `./.tmp/${key}_${name}`;
      fs.writeFileSync(fileLocation, buffer);
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
      const dbThumbnail = await ctx.prisma.file.create({ data: { ...videoData.thumbnail, name } });
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
