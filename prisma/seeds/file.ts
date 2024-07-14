import { PrismaClient } from '@prisma/client';
import S3 from '../../server/utils/s3.js';
import fileProcessor from '../../server/utils/fileProcessor.js';
import fs from 'fs';

const prisma = new PrismaClient();
const s3 = new S3();

export default async () => {
  // define seeds
  const targetDir = process.env.WORKING_TMP_FOLDER || './.tmp';
  if (fs.existsSync(targetDir)) fs.rmSync(targetDir, { recursive: true });
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir);

  let count = 0;
  const allFiles = await s3.getAllFiles();

  for (let i = 0; i < allFiles.length; i++) {
    const file = allFiles[i];

    // check content type
    // if video
    if (file.contentType.startsWith('video/')) {
      // get metadata
      const videoName = file.fullPath.split('/').pop() || '';
      const videoMetadata = await fileProcessor.video.getMetadata({ videoPath: file.fullPath });
      const newThumbnail = await fileProcessor.video.getThumbnailAt({
        videoPath: file.fullPath,
        duration: videoMetadata.duration,
        timePercentage: 10,
      });
      const imageMetadata = await fileProcessor.image.getMetadata(newThumbnail);

      // upload to s3
      await s3.upload({
        targetPath: file.key.replace(videoName, newThumbnail.name),
        localPath: newThumbnail.path,
      });

      // insert into db
      await prisma.file.create({
        data: {
          name: videoName,
          path: file.fullPath,
          type: 'video',
          size: file.size.toString(),
          metadata: videoMetadata,
        },
      });
      await prisma.file.create({
        data: {
          name: newThumbnail.name,
          path: file.fullPath.replace(videoName, newThumbnail.name),
          type: 'thumbnail',
          size: '0',
          metadata: imageMetadata,
        },
      });

      // cleanup
      fs.rmSync(newThumbnail.path);

      count += 2;
    }
    // if image
    else if (file.contentType.startsWith('image/')) {
      // get metadata
      const imageName = file.fullPath.split('/').pop() || '';
      const imageMetadata = await fileProcessor.image.getMetadata({
        name: imageName,
        path: file.fullPath,
      });

      // insert into db
      await prisma.file.create({
        data: {
          name: imageName,
          path: file.fullPath,
          type: 'image',
          size: file.size.toString(),
          metadata: imageMetadata,
        },
      });

      // cleanup
      count++;
    }
  }

  console.log('Insert file: ', count);
};
