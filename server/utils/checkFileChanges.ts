import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import S3 from './s3.js';
import fileProcessor from './fileProcessor.js';
import shell from 'shelljs';
import fs from 'fs';

const prisma = new PrismaClient();
const s3Instance = S3.getInstance({
  region: useRuntimeConfig().s3.region || '',
  endpoint: useRuntimeConfig().s3.endpoint || '',
  accessKeyId: useRuntimeConfig().s3.accessKey || '',
  secretAccessKey: useRuntimeConfig().s3.secretKey || '',
});

export async function getAllFiles(all: boolean = false) {
  const allFiles = await s3Instance.getAllFiles(all);
  return allFiles;
}

export async function updatePermissions(allFiles: any[]) {
  for (const file of allFiles) {
    const { key } = file;
    console.log('updating permissions for', key);
    await s3Instance.updateFilePermissions(key);
  }
  return allFiles.length;
}

export async function checkFileChanges(
  allFiles: any[],
  opts?: { newThumbnails?: boolean; missingThumbnail?: boolean },
): Promise<boolean> {
  const { newThumbnails = false, missingThumbnail = false } = opts || {};

  // print out what we are doing
  if (newThumbnails) {
    console.log('Starting: Recreating thumbnails');
  } else if (missingThumbnail) {
    console.log('Starting: Missing thumbnails');
  } else {
    console.log('Starting: Full file check');
  }

  // clear tmp folder
  const targetDir = './.tmp';
  if (fs.existsSync(targetDir)) fs.rmSync(targetDir, { recursive: true });
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir);

  // check file count if doing full check
  if (!newThumbnails && !missingThumbnail) {
    const itemCount = await prisma.item.count();
    if (allFiles.length === itemCount) {
      console.log('No new files to process');
      return true;
    }
  }

  // format them as needed
  let count = 0;
  for (let i = 0; i < allFiles.length; i++) {
    const file = allFiles[i];

    // check if already processed
    // only check if doing full check
    if (!newThumbnails && !missingThumbnail) {
      const existingFile = await prisma.item.findFirst({
        where: { path: file.fullPath },
      });
      if (existingFile) continue;
    }

    // check if thumbnail already exists
    if (missingThumbnail) {
      const thumbnailExists = await s3Instance.checkFileExists(`${file.key}.thumbnail.jpg`);
      // thumbnail exists, skip
      if (thumbnailExists) continue;
    }

    console.log(`Processing file ${file.key}`);

    // check if file is accessible
    const { stdout: canAccessFile } = shell.exec(`curl -I ${file.fullPath}`, { silent: true });
    if (/HTTP(?:\/\d(?:\.\d)?)? 403/.test(canAccessFile)) {
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

      // insert file into db if not only updating thumbnails
      if (!newThumbnails && !missingThumbnail) {
        // insert item into db
        await prisma.item.create({
          data: {
            // item data
            description: '',
            people: '',
            dateEstimate: true,
            takenAt: dayjs().toISOString().split('T')[0],
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
      }

      // cleanup
      fileProcessor.delete(videoName);
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

      // insert file into db if not only updating thumbnails
      if (!newThumbnails && !missingThumbnail) {
        // insert item into db
        await prisma.item.create({
          data: {
            // item data
            description: '',
            people: '',
            dateEstimate: true,
            takenAt: dayjs().toISOString().split('T')[0],
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
      }

      // cleanup
      fileProcessor.delete(imageName);
      count++;
    }
    // if document
    else if (file.contentType.startsWith('application/pdf')) {
      // get metadata
      const documentName = file.key.split('/').pop() || '';
      const documentMetadata = await fileProcessor.pdf.getMetadata({
        name: documentName,
        path: file.fullPath,
      });

      // thumbnail
      const newDocumentThumbnail = await fileProcessor.pdf.getThumbnail({
        name: documentName,
        path: file.fullPath,
      });
      await s3Instance.upload({
        targetPath: file.key.replace(documentName, newDocumentThumbnail.name),
        localPath: newDocumentThumbnail.path,
      });

      // insert file into db if not only updating thumbnails
      if (!newThumbnails && !missingThumbnail) {
        // insert file into db
        await prisma.item.create({
          data: {
            // item data
            description: '',
            people: '',
            dateEstimate: true,
            takenAt: dayjs().toISOString().split('T')[0],
            type: 'document',
            // file data
            name: documentName,
            path: file.fullPath,
            size: file.size.toString(),
            metadata: documentMetadata,
            // privacy
            published: 'private',
            // owner
            owner: { connect: { email: 'j.larminay@gmail.com' } },
          },
        });
      }

      // cleanup
      fileProcessor.delete(documentName);
      count++;
    }

    // add delay of 0.5s
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // console log if needed
  console.log(`Inserted ${count} files`);
  return true;
}
