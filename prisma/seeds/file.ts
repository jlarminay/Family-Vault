import { PrismaClient } from '@prisma/client';
import S3 from '../../server/utils/s3.js';
import VideoProcessor from '../../server/utils/videoProcessor.js';
import ImageProcessor from '../../server/utils/imageProcessor.js';
import fs from 'fs';

const prisma = new PrismaClient();
const s3 = new S3();

export default async () => {
  // define seeds
  const targetDir = process.env.WORKING_TMP_FOLDER || './.tmp';
  if (fs.existsSync(targetDir)) fs.rmSync(targetDir, { recursive: true });
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir);

  let count = 0;
  const newData = [
    './videos/demo1.mp4',
    './videos/demo2.mp4',
    './videos/demo3.mp4',
    './videos/demo4.mp4',
    './videos/demo5.mp4',
    './videos/demo6.mp4',
    './videos/demo7.mp4',
  ];

  // create seeds
  for (let i = 0; i < newData.length; i++) {
    // detect what type of file
    const type = newData[i].split('.').pop();
    const key = Math.random().toString(36).substring(2, 12);

    // manage video
    if (type === 'mp4') {
      const processing = new VideoProcessor('./prisma/seeds/' + newData[i]);
      const results = await processing.prepareNewVideo();

      // upload to s3
      await s3.upload({
        key: `videos/${results.video.name}`,
        filePath: `./prisma/seeds/videos/${results.video.name}`,
      });
      await s3.upload({
        key: `videos/${results.thumbnail.name}`,
        filePath: `${targetDir}/${results.thumbnail.name}`,
      });

      // insert into db
      await prisma.file.create({
        data: {
          ...results.video,
          size: results.video.size.toString(),
        },
      });
      await prisma.file.create({
        data: {
          ...results.thumbnail,
          size: results.thumbnail.size.toString(),
        },
      });
      count += 2;
    }
  }

  console.log('Insert file: ', count);
};
