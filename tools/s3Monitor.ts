import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import S3 from '../server/utils/s3.js';
import fileProcessor from '../server/utils/fileProcessor.js';
import shell from 'shelljs';
import fs from 'fs';

const prisma = new PrismaClient();
const s3 = new S3();

async function waitForReset() {
  console.log('Waiting for 60 seconds before checking again');
  console.log('');
  // wait for 60 seconds
  await new Promise((resolve) => setTimeout(resolve, 60 * 1000));
}

async function main() {
  console.log('Starting to monitor s3 bucket for changes');

  const targetDir = process.env.WORKING_TMP_FOLDER || './.tmp';
  if (fs.existsSync(targetDir)) fs.rmSync(targetDir, { recursive: true });
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir);

  while (true) {
    // get last updated time
    let lastCreatedAt = dayjs('1900-01-01');
    const lastCreatedItem = await prisma.item.findFirst({
      orderBy: { updatedAt: 'desc' },
    });
    if (lastCreatedItem) lastCreatedAt = dayjs(lastCreatedItem.createdAt).startOf('second');

    // get all files from s3
    const allFiles = await s3.getAllFiles();

    console.log(`Found ${allFiles.length} files`);

    // // filter files that are newer than last updated time
    // const newFiles = allFiles.filter((file) =>
    //   dayjs(file.lastModified).startOf('second').isAfter(dayjs(lastCreatedAt)),
    // );

    // format them as needed
    let count = 0;
    for (let i = 0; i < allFiles.length; i++) {
      const file = allFiles[i];

      // check if already processed
      const existingFile = await prisma.item.findFirst({
        where: { path: file.fullPath },
      });
      if (existingFile) continue;

      console.log(`Processing file ${file.key}`);

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
        const newVideoThumbnail = await fileProcessor.video.getThumbnailAt({
          videoName: videoName,
          videoPath: file.fullPath,
          duration: videoMetadata.duration,
          timePercentage: 10,
        });

        // upload to s3
        await s3.upload({
          targetPath: file.key.replace(videoName, newVideoThumbnail.name),
          localPath: newVideoThumbnail.path,
        });

        // insert item into db
        await prisma.item.create({
          data: {
            // item data
            description: '',
            people: '',
            dateEstimate: true,
            takenAt: dayjs().toDate(),
            type: 'video',
            // file data
            name: videoName,
            path: file.fullPath,
            size: file.size.toString(),
            metadata: videoMetadata,
            // privacy
            published: 'private',
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
        await s3.upload({
          targetPath: file.key.replace(imageName, newImageThumbnail.name),
          localPath: newImageThumbnail.path,
        });

        // insert item into db
        await prisma.item.create({
          data: {
            // item data
            description: '',
            people: '',
            dateEstimate: true,
            takenAt: dayjs().toDate(),
            type: 'image',
            // file data
            name: imageName,
            path: file.fullPath,
            size: file.size.toString(),
            metadata: imageMetadata,
            // privacy
            published: 'private',
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

    // console log if needed
    if (count > 0) console.log(`Inserted ${count} files`);

    // wait given time
    await waitForReset();
  }
}

main();
