import { PrismaClient } from '@prisma/client';
import S3 from '../../server/utils/s3.js';
import fileProcessor from '../../server/utils/fileProcessor.js';
import fs from 'fs';
import shell from 'shelljs';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';

const prisma = new PrismaClient();
const s3Instance = S3.getInstance();

export default async () => {
  // define seeds
  const targetDir = process.env.WORKING_TMP_FOLDER || './.tmp';
  if (fs.existsSync(targetDir)) fs.rmSync(targetDir, { recursive: true });
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir);

  let count = 0;
  const allFiles = await s3Instance.getAllFiles();

  for (let i = 0; i < allFiles.length; i++) {
    const file = allFiles[i];

    // check if already processed
    const existingFile = await prisma.item.findFirst({
      where: { path: file.fullPath },
    });
    if (existingFile) continue;

    // check if file is accessible
    const { stdout: canAccessFile } = shell.exec(`curl -I ${file.fullPath}`, { silent: true });
    if (canAccessFile.includes('HTTP/1.1 403')) {
      // update privacy of file
      await s3Instance.updateFilePermissions(file.key);
    }

    // check content type
    // if video
    if (file.contentType.startsWith('video/')) {
      // get metadata
      const videoName = file.key.split('/').pop() || '';
      const videoMetadata = await fileProcessor.video.getMetadata({ videoPath: file.fullPath });
      const newVideoThumbnail = await fileProcessor.video.getThumbnailAt({
        videoName: videoName,
        videoPath: file.fullPath,
        duration: videoMetadata.duration,
        timePercentage: 10,
      });

      // upload to s3
      await s3Instance.upload({
        targetPath: file.key.replace(videoName, newVideoThumbnail.name),
        localPath: newVideoThumbnail.path,
      });

      // insert files into db
      await prisma.item.create({
        data: {
          // item data
          description: faker.commerce.productDescription(),
          people: Array.from({ length: Math.floor(Math.random() * 5) }, () =>
            faker.person.firstName(),
          ).join(', '),
          dateEstimate: Math.random() < 0.5 ? true : false,
          takenAt: (count === 0
            ? dayjs().toDate()
            : dayjs()
                .subtract(Math.floor(Math.random() * 400) + 1, 'day')
                .toDate()
          )
            .toISOString()
            .split('T')[0],
          type: 'video',
          // file data
          name: videoName,
          path: file.fullPath,
          size: file.size.toString(),
          metadata: videoMetadata,
          // privacy
          published: 'public',
          // owner
          owner: { connect: { email: 'j.larminay@gmail.com' } },
        },
      });

      // cleanup
      fileProcessor.image.delete(newVideoThumbnail.name);

      count++;
    }
    // if image
    else if (file.contentType.startsWith('image/')) {
      // get metadata
      const imageName = file.key.split('/').pop() || '';
      const imageMetadata = await fileProcessor.image.getMetadata({
        name: imageName,
        path: file.fullPath,
      });
      const newImageThumbnail = await fileProcessor.image.getThumbnail({
        name: imageName,
        path: file.fullPath,
      });

      // upload to s3
      await s3Instance.upload({
        targetPath: file.key.replace(imageName, newImageThumbnail.name),
        localPath: newImageThumbnail.path,
      });

      // insert file into db
      await prisma.item.create({
        data: {
          // item data
          description: faker.commerce.productDescription(),
          people: Array.from({ length: Math.floor(Math.random() * 5) }, () =>
            faker.person.firstName(),
          ).join(', '),
          dateEstimate: Math.random() < 0.5 ? true : false,
          takenAt: (count === 0
            ? dayjs().toDate()
            : dayjs()
                .subtract(Math.floor(Math.random() * 400) + 1, 'day')
                .toDate()
          )
            .toISOString()
            .split('T')[0],
          type: 'image',
          // file data
          name: imageName,
          path: file.fullPath,
          size: file.size.toString(),
          metadata: imageMetadata,
          // privacy
          published: 'public',
          // owner
          owner: { connect: { email: 'j.larminay@gmail.com' } },
        },
      });

      // cleanup
      fileProcessor.image.delete(imageName);
      fileProcessor.image.delete(newImageThumbnail.name);

      // cleanup
      count++;
    }

    // add delay of 0.5s
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log('Insert file: ', count);
};
