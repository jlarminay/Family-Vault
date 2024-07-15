import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import S3 from '../server/utils/s3.js';
import fileProcessor from '../server/utils/fileProcessor.js';
import shell from 'shelljs';
import fs from 'fs';

const prisma = new PrismaClient();
const s3 = new S3();

async function waitForReset() {
  // wait for 10 seconds
  await new Promise((resolve) => setTimeout(resolve, 10000));
}

async function main() {
  console.log('Starting to monitor s3 bucket for changes');

  while (true) {
    // get last updated time
    let lastCreatedAt = dayjs('1900-01-01');
    const lastCreatedItem = await prisma.file.findFirst({
      orderBy: { updatedAt: 'desc' },
    });
    if (lastCreatedItem) lastCreatedAt = dayjs(lastCreatedItem.createdAt).startOf('second');

    // get all files from s3
    const allFiles = await s3.getAllFiles();

    // filter files that are newer than last updated time
    const newFiles = allFiles.filter((file) =>
      dayjs(file.lastModified).startOf('second').isAfter(dayjs(lastCreatedAt)),
    );

    // format them as needed
    let count = 0;
    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];

      // check if already processed
      const existingFile = await prisma.file.findFirst({
        where: { path: file.fullPath },
      });
      if (existingFile) continue;

      // check if file is accessible
      const { stdout: canAccessFile } = shell.exec(`curl -I ${file.fullPath}`, { silent: true });
      if (canAccessFile.includes('HTTP/1.1 403')) {
        // update privacy of file
        await s3.updateFilePermissions(file.key);
      }

      // check content type
      // if video
      if (file.contentType.startsWith('video/')) {
        // get metadata
        const videoName = file.key.split('/').pop() || '';
        const videoMetadata = await fileProcessor.video.getMetadata({ videoPath: file.fullPath });
        const newThumbnail = await fileProcessor.video.getThumbnailAt({
          videoName: videoName,
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

        // insert files into db
        const newVideo = await prisma.file.create({
          data: {
            name: videoName,
            path: file.fullPath.replace(' ', '%20'),
            type: 'video',
            size: file.size.toString(),
            metadata: videoMetadata,
          },
        });
        const newImage = await prisma.file.create({
          data: {
            name: newThumbnail.name,
            path: file.fullPath.replace(videoName, newThumbnail.name).replace(' ', '%20'),
            type: 'thumbnail',
            size: imageMetadata.size.toString(),
            metadata: imageMetadata,
          },
        });
        // insert item into db
        await prisma.item.create({
          data: {
            type: 'video',
            owner: { connect: { email: 'j.larminay@gmail.com' } },
            dateOrder: dayjs().toISOString(),
            file: {
              connect: [{ id: newVideo.id }, { id: newImage.id }],
            },
          },
        });

        // cleanup
        fileProcessor.image.delete(newThumbnail.name);

        count += 2;
      }
      // if image
      else if (file.contentType.startsWith('image/')) {
        // get metadata
        const imageName = file.key.split('/').pop() || '';
        const imageMetadata = await fileProcessor.image.getMetadata({
          name: imageName,
          path: file.fullPath,
        });

        // insert file into db
        const newImage = await prisma.file.create({
          data: {
            name: imageName,
            path: file.fullPath.replace(' ', '%20'),
            type: 'image',
            size: file.size.toString(),
            metadata: imageMetadata,
          },
        });
        // insert item into db
        await prisma.item.create({
          data: {
            type: 'image',
            owner: { connect: { email: 'j.larminay@gmail.com' } },
            dateOrder: dayjs().toISOString(),
            file: {
              connect: { id: newImage.id },
            },
          },
        });

        // cleanup
        fileProcessor.image.delete(imageName);

        // cleanup
        count++;
      }
    }

    // console log if needed
    if (count > 0) console.log(`Inserted ${count} files`);

    // wait given time
    await waitForReset();
  }
}

main();
