import { PrismaClient } from '@prisma/client';
import S3 from '../../server/utils/s3.js';
import VideoProcessor from '../../server/utils/videoProcessor.js';
import ImageProcessor from '../../server/utils/imageProcessor.js';

const prisma = new PrismaClient();
const s3 = new S3();

export default async () => {
  // define seeds
  const targetDir = process.env.WORKING_TMP_FOLDER || './.tmp';
  let count = 0;
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
    const type = newData[i].split('.').pop();

    // manage video
    if (type === 'mp4') {
      const processing = new VideoProcessor('./prisma/seeds/' + newData[i]);
      const results = await processing.prepareNewVideo();

      // upload to s3
      await s3.upload({
        key: `videos/${results.randomString}_${results.video.name}`,
        filePath: './prisma/seeds/videos/' + results.video.name,
      });
      await s3.upload({
        key: `videos/${results.randomString}_${results.thumbnail.name}`,
        filePath: `${targetDir}/${results.thumbnail.name}`,
      });

      // insert into db
      await prisma.file.create({ data: results.video });
      await prisma.file.create({ data: results.thumbnail });
      count += 2;
    }

    // manage image
    if (type === 'webp') {
      const processing = new ImageProcessor('./prisma/seeds/' + newData[i]);
      const results = await processing.prepareNewImage();

      // upload image
      await s3.upload({
        key: `persons/${results.randomString}_${results.image.name}`,
        filePath: './prisma/seeds/images/' + results.image.name,
      });

      // insert into db
      await prisma.file.create({ data: results.image });
      count++;
    }
  }

  console.log('Insert file: ', count);
};
