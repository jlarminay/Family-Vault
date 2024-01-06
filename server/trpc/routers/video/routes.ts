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
    const { key, current, name, total, packet } = input;

    // console.log('key: ', key, 'current: ', current, 'total: ', total, 'packet: ', packet.length);

    // create folder if not exists
    if (!fs.existsSync('./.tmp')) {
      fs.mkdirSync('./.tmp');
    }

    // append packet to file
    fs.appendFile(`./.tmp/${key}.${current}.tmp`, packet, () => {});

    // if not final packet, return
    if (current !== total) return true;

    let fileLocation: string = '';
    let videoData: any = {};

    // convert data back into video file
    {
      // sleep for 1 sec
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // take all files and combine in order
      let allPackets = '';
      for (let i = 1; i <= total; i++) {
        const packet = fs.readFileSync(`./.tmp/${key}.${i}.tmp`);
        fs.unlinkSync(`./.tmp/${key}.${i}.tmp`);
        allPackets += packet;
      }

      // convert back into file
      const fileType = allPackets.split(';base64,')[0].split('/')[1];
      const fileName = name.replaceAll('.mp4', '');
      const rawData = allPackets.split(';base64,')[1];
      const buffer = Buffer.from(rawData, 'base64');
      fileLocation = `./.tmp/${fileName}.${fileType}`;
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
      const dbVideo = await ctx.prisma.file.create({ data: videoData.video });
      const dbThumbnail = await ctx.prisma.file.create({ data: videoData.thumbnail });
      console.log('dbVideo: ', dbVideo);
      console.log('dbThumbnail: ', dbThumbnail);
      return ctx.prisma.video.create({
        data: {
          title: videoData.video.name,
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
