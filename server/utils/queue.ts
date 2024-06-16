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
      packets: number;
      name: string;
      targetDir: string;
      session: any;
      prisma: PrismaClient;
    },
    cb: any,
  ) => {
    const { videoId, key, packets, name, targetDir, session, prisma } = input;
    let videoData: any = {};

    let cleanedName = name.replace(/\s+/g, '-').toLowerCase();
    let fileLocation: string = `${targetDir}/${key}_${cleanedName}`;

    console.log('processing video', key, name);

    // convert data back into video file
    try {
      let allBuffers: any = [];

      // check that file is ready to be read
      for (let i = 1; i <= packets; i++) {
        const file = `${targetDir}/${key}.${i}.tmp`;

        try {
          fs.readFileSync(file);
        } catch (e) {
          throw new Error(`File not ready: ${file}`);
        }

        const string = fs.readFileSync(file).toString();
        const buffer = Buffer.from(string, 'base64');
        allBuffers.push(buffer);
      }

      const combinedStrings = Buffer.concat(allBuffers);
      fs.writeFileSync(fileLocation, combinedStrings);

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (_e) {
      console.log('failed to combine packets', key, packets, cleanedName);
      return cb(new Error('failed to combine packets'));
    }

    // get metadata
    try {
      const processing = new VideoProcessor(fileLocation);
      videoData = await processing.prepareNewVideo();
    } catch (_e) {
      console.log('failed to process video', key, packets, cleanedName);
      return cb(new Error('failed to process video'));
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
    } catch (_e) {
      console.log('failed to upload to s3', key, packets, name);
      return cb(new Error('failed to upload to s3'));
    }

    // insert into db
    try {
      const dbVideo = await prisma.file.create({ data: { ...videoData.video, name } });
      const dbThumbnail = await prisma.file.create({
        data: { ...videoData.thumbnail, name },
      });
      await prisma.video.update({
        where: { id: videoId },
        data: {
          videoId: dbVideo.id,
          thumbnailId: dbThumbnail.id,
          status: 'finished',
        },
      });
    } catch (_e) {
      console.log('failed to insert into db', key, name);
      return cb(new Error('failed to insert into db'));
    }

    // delete all old files
    try {
      const filesToDelete = fs.readdirSync(targetDir).filter((file) => file.startsWith(key));
      filesToDelete.forEach((file) => {
        fs.unlinkSync(`${targetDir}/${file}`);
      });
    } catch (_e) {
      console.log('failed to delete files', key, packets, name);
      return cb(new Error('failed to delete files'));
    }

    return cb();
  },
  {
    concurrent: 1,
    afterProcessDelay: 30000,
    maxRetries: 3,
    retryDelay: 30000,
  },
);

queue.on('task_finish', (taskId: any, result: any) => {
  console.log('task finished', taskId, result);
});

queue.on('task_failed', (taskId: any, err: any, stats: any) => {
  console.log('task failed', taskId, err, stats);
});

queue.on('task_progress', (taskId: any, progress: any) => {
  console.log('task progress', taskId, progress);
});

export default queue;
