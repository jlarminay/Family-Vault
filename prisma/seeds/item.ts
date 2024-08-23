import { PrismaClient } from '@prisma/client';
import S3 from '../../server/utils/s3.js';
import fileProcessor from '../../server/utils/fileProcessor.js';
import fs from 'fs';
import shell from 'shelljs';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';

// TESTING CODE
const generateThumbnail = false;

const prisma = new PrismaClient();
const s3Instance = S3.getInstance({
  region: process.env.S3_REGION || '',
  endpoint: process.env.S3_ENDPOINT || '',
  accessKeyId: process.env.S3_ACCESS_KEY || '',
  secretAccessKey: process.env.S3_SECRET_KEY || '',
});

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

    // new data
    const newData = {
      // item data
      description: faker.commerce.productDescription(),
      people: Array.from({ length: Math.floor(Math.random() * 5) }, () =>
        faker.person.firstName(),
      ).join(', '),

      // date
      dateEstimate: Math.random() < 0.5 ? true : false,
      takenAt: (count === 0
        ? dayjs().toDate()
        : dayjs()
            .subtract(Math.floor(Math.random() * 400) + 1, 'day')
            .toDate()
      )
        .toISOString()
        .split('T')[0],

      // location
      location: {
        connect: { id: Math.floor(Math.random() * 10) + 1 },
      },
    };

    // check content type
    // if video
    if (file.contentType.startsWith('video/')) {
      // get metadata
      const videoName = file.key.split('/').pop() || '';
      const videoMetadata = await fileProcessor.video.getMetadata({ videoPath: file.fullPath });

      if (generateThumbnail) {
        const newVideoThumbnail = await fileProcessor.video.getThumbnailAt({
          videoName: videoName,
          videoPath: file.fullPath,
          duration: videoMetadata.duration,
          timePercentage: 10,
        });
        await s3Instance.upload({
          targetPath: file.key.replace(videoName, newVideoThumbnail.name),
          localPath: newVideoThumbnail.path,
        });
        fileProcessor.image.delete(newVideoThumbnail.name);
      }

      // insert files into db
      await prisma.item.create({
        data: {
          ...newData,
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

      if (generateThumbnail) {
        const newImageThumbnail = await fileProcessor.image.getThumbnail({
          name: imageName,
          path: file.fullPath,
        });
        await s3Instance.upload({
          targetPath: file.key.replace(imageName, newImageThumbnail.name),
          localPath: newImageThumbnail.path,
        });
        fileProcessor.image.delete(newImageThumbnail.name);
      }

      // insert file into db
      await prisma.item.create({
        data: {
          ...newData,
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

      // cleanup
      count++;
    }
    // if pdf
    else if (file.contentType.startsWith('application/pdf')) {
      // get metadata
      const documentName = file.key.split('/').pop() || '';
      const documentMetadata = await fileProcessor.pdf.getMetadata({
        name: documentName,
        path: file.fullPath,
      });

      if (generateThumbnail) {
        const newDocumentThumbnail = await fileProcessor.pdf.getThumbnail({
          name: documentName,
          path: file.fullPath,
        });
        await s3Instance.upload({
          targetPath: file.key.replace(documentName, newDocumentThumbnail.name),
          localPath: newDocumentThumbnail.path,
        });
        fileProcessor.pdf.delete(newDocumentThumbnail.name);
      }

      // insert file into db
      await prisma.item.create({
        data: {
          ...newData,
          type: 'document',
          // file data
          name: documentName,
          path: file.fullPath,
          size: file.size.toString(),
          metadata: documentMetadata,
          // privacy
          published: 'public',
          // owner
          owner: { connect: { email: 'j.larminay@gmail.com' } },
        },
      });

      // cleanup
      fileProcessor.pdf.delete(documentName);

      // cleanup
      count++;
    }
  }

  console.log('Insert file: ', count);
};
