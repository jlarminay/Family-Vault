import { PrismaClient } from '@prisma/client';
import S3 from '../../server/utils/s3.js';
import VideoProcessor from '../../server/utils/videoProcessor.js';
import { resolve } from 'path';
import { createReadStream } from 'fs';

const prisma = new PrismaClient();
const s3 = new S3();

export default async () => {
  // define seeds
  const newData = ['./videos/demo1.mp4', './videos/demo2.mp4', './videos/demo3.mp4'];
  let finalData = [];

  // create seeds
  for (let i = 0; i < newData.length; i++) {
    // detect what type of file
    const randomString = Math.random().toString(16).slice(2);
    const type = newData[i].split('.').pop();

    // manage video
    if (type === 'mp4') {
      let videoData: any = {};
      let thumbnailData: any = {};

      // manage video
      const video = newData[i];
      videoData.name = `${randomString}_${video.split('/').pop()}`;
      // get metadata
      const processing = new VideoProcessor('./prisma/seeds/' + video);
      const { duration, resolution, size } = await processing.getMetadata();
      videoData = {
        ...videoData,
        type: 'video',
        path: `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/videos/${videoData.name}`,
        size: size,
        metadata: {
          resolution: resolution,
          duration: duration,
        },
      };
      // upload video
      const videoStream = createReadStream(resolve('./prisma/seeds/' + video));
      await s3.upload({ key: `videos/${videoData.name}`, body: videoStream });
      finalData.push(videoData);

      // manage thumbnail
      thumbnailData.name = videoData.name.replace('.mp4', '.webp');
      // generate
      await processing.getThumbnailAt({ time: '00:00:00', filename: thumbnailData.name });
      // get metadata
      thumbnailData = {
        ...thumbnailData,
        type: 'image',
        path: `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/videos/${thumbnailData.name}`,
        size: size,
        metadata: {
          resolution: resolution,
        },
      };
      // upload thumbnail
      const imageData = createReadStream(resolve('./.tmp/' + thumbnailData.name));
      await s3.upload({ key: `videos/${videoData.name}`, body: imageData });
      finalData.push(thumbnailData);
    }
  }

  // insert to db
  finalData.forEach(async (data) => {
    await prisma.file.create({
      data,
    });
  });

  console.log('Insert file: ', newData.length);
};
