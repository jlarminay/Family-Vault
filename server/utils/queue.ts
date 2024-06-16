import Queue from 'better-queue';
import { PrismaClient } from '@prisma/client';
import VideoProcessor from '@/server/utils/videoProcessor.js';
import S3 from '@/server/utils/s3.js';
import fs from 'fs';

const queue = new Queue(
  async (
    input: {
      key: string;
      packets: number;
      name: string;
      targetDir: string;
      session: any;
      prisma: PrismaClient;
    },
    cb: any,
  ) => {
    const { key, packets, name, targetDir, session, prisma } = input;
    let videoData: any = {};

    let cleanedName = name.replace(/\s+/g, '-').toLowerCase();
    let fileLocation: string = `${targetDir}/${key}_${cleanedName}`;

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
      const dbVideo = await prisma.file.create({ data: { ...videoData.video, name } });
      const dbThumbnail = await prisma.file.create({
        data: { ...videoData.thumbnail, name },
      });
      await prisma.video.create({
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

    // delete all old files
    try {
      const filesToDelete = fs.readdirSync(targetDir).filter((file) => file.startsWith(key));
      filesToDelete.forEach((file) => {
        fs.unlinkSync(`${targetDir}/${file}`);
      });
    } catch (e) {
      console.log('failed to delete files', key, packets, name, e);
      return false;
    }

    cb();
  },
  {
    concurrent: 1,
    afterProcessDelay: 30000,
    maxRetries: 3,
    retryDelay: 30000,
  },
);

export default queue;
