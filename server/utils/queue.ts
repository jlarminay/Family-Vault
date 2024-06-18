import Queue from 'better-queue';
import { PrismaClient } from '@prisma/client';
import VideoProcessor from '@/server/utils/videoProcessor.js';
import S3 from '@/server/utils/s3.js';
import fs from 'fs';

const queue = new Queue(
  async (
    input: {
      videoId: number;
      key: string;
      name: string;
      targetVideo: string;
      prisma: PrismaClient;
    },
    cb: any,
  ) => {
    const { videoId, key, name, targetVideo, prisma } = input;
    const targetDir = useRuntimeConfig().public.workingTmpFolder as string;
    let videoData: any = {};

    console.log('processing video', key, name);

    // get metadata
    try {
      const processing = new VideoProcessor(targetVideo);
      videoData = await processing.prepareNewVideo();
    } catch (_e) {
      console.log('failed to process video', key, targetVideo);
      return cb(new Error('failed to process video'));
    }

    // upload to s3
    try {
      const s3 = new S3();
      await s3.upload({
        key: `videos/${videoData.video.name}`,
        filePath: `${targetDir}/${videoData.video.name}`,
      });
      await s3.upload({
        key: `videos/${videoData.thumbnail.name}`,
        filePath: `${targetDir}/${videoData.thumbnail.name}`,
      });
    } catch (_e) {
      console.log('failed to upload to s3', key, name);
      return cb(new Error('failed to upload to s3'));
    }

    // insert into db
    try {
      const dbVideo = await prisma.file.create({ data: { ...videoData.video, name } });
      console.log(dbVideo);
      const dbThumbnail = await prisma.file.create({
        data: { ...videoData.thumbnail, name },
      });
      console.log(dbThumbnail);
      const updateVideo = await prisma.video.update({
        where: { id: videoId },
        data: {
          videoId: dbVideo.id,
          thumbnailId: dbThumbnail.id,
          status: 'finished',
        },
      });
      console.log(updateVideo);
    } catch (e) {
      console.log('failed to insert into db', key, name);
      console.log(e);
      return cb(new Error('failed to insert into db'));
    }

    // delete all old files
    try {
      fs.unlinkSync(`${targetDir}/${videoData.video.name}`);
      fs.unlinkSync(`${targetDir}/${videoData.thumbnail.name}`);
    } catch (_e) {
      console.log('failed to delete files', key, name);
      return cb(new Error('failed to delete files'));
    }

    return cb();
  },
  {
    concurrent: 1,
    afterProcessDelay: 1000,
    maxRetries: 3,
    retryDelay: 1000,
  },
);

queue.on('task_finish', (taskId: any) => {
  console.log('task finished', taskId);
});

queue.on('task_failed', (taskId: any, err: any) => {
  console.log('task failed', taskId, err);
});

export default queue;
