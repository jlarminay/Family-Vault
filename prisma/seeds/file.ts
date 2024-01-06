import { PrismaClient } from '@prisma/client';
import S3 from '../../server/utils/s3.js';
import VideoProcessor from '../../server/utils/videoProcessor.js';
import { resolve } from 'path';
import { createReadStream, statSync } from 'fs';
import sizeOf from 'image-size';

const prisma = new PrismaClient();
const s3 = new S3();

export default async () => {
  // define seeds
  const newData = [
    './videos/demo1.mp4',
    './videos/demo2.mp4',
    './videos/demo3.mp4',
    './videos/demo4.mp4',
    './videos/demo5.mp4',
    './images/alex-gerogory.webp',
    './images/billson-smith.webp',
    './images/david-michel.webp',
    './images/ippie-jones.webp',
    './images/jessica-jones.webp',
    './images/josh-larminay.webp',
  ];

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
      videoData.name = video.split('/').pop();
      // get metadata
      const processing = new VideoProcessor('./prisma/seeds/' + video);
      const { duration, resolution, size } = await processing.getMetadata();
      videoData = {
        ...videoData,
        type: 'video',
        path: `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/videos/${randomString}_${videoData.name}`,
        size: size,
        metadata: {
          resolution: resolution,
          duration: duration,
        },
      };
      // upload video
      const videoStream = createReadStream(resolve('./prisma/seeds/' + video));
      await s3.upload({ key: `videos/${randomString}_${videoData.name}`, body: videoStream });
      await prisma.file.create({ data: videoData });

      // manage thumbnail
      thumbnailData.name = videoData.name.replace('.mp4', '.webp');
      // generate
      await processing.getThumbnailAt({ time: '00:00:00', filename: thumbnailData.name });
      const dimensions = sizeOf(resolve('./.tmp/' + thumbnailData.name));
      // get metadata
      thumbnailData = {
        name: thumbnailData.name,
        type: 'image',
        path: `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/videos/${randomString}_${thumbnailData.name}`,
        size: statSync(resolve('./.tmp/' + thumbnailData.name)).size,
        metadata: {
          resolution: `${dimensions.width}x${dimensions.height}`,
        },
      };
      // upload thumbnail
      const imageData = createReadStream(resolve('./.tmp/' + thumbnailData.name));
      await s3.upload({ key: `videos/${randomString}_${thumbnailData.name}`, body: imageData });
      await prisma.file.create({ data: thumbnailData });
    }

    // manage image
    if (type === 'webp') {
      let imageData: any = {};

      // manage image
      const image = newData[i];
      imageData.name = `${randomString}_${image.split('/').pop()}`;
      const dimensions = sizeOf(resolve('./prisma/seeds/' + image));
      // get metadata
      imageData = {
        ...imageData,
        type: 'image',
        path: `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/persons/${imageData.name}`,
        size: statSync(resolve('./prisma/seeds/' + image)).size,
        metadata: {
          resolution: `${dimensions.width}x${dimensions.height}`,
        },
      };
      // upload image
      const imageStream = createReadStream(resolve('./prisma/seeds/' + image));
      await s3.upload({ key: `persons/${imageData.name}`, body: imageStream });
      await prisma.file.create({ data: imageData });
    }
  }

  console.log('Insert file: ', newData.length);
};
