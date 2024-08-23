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

export async function checkFileChanges(
  opts: { updateThumbnailOnly: boolean } = { updateThumbnailOnly: false },
): Promise<boolean> {
  const { updateThumbnailOnly } = opts;

  if (updateThumbnailOnly) {
    console.log('Running thumbnail update only');
  } else {
    console.log('Running full file check');
  }

  const targetDir = process.env.WORKING_TMP_FOLDER || './.tmp';
  if (fs.existsSync(targetDir)) fs.rmSync(targetDir, { recursive: true });
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir);

  // get all files from s3
  const allFiles = await s3Instance.getAllFiles();

  console.log(`Found ${allFiles.length} files`);

  // check file count
  if (!updateThumbnailOnly) {
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
    if (!updateThumbnailOnly) {
      const existingFile = await prisma.item.findFirst({
        where: { path: file.fullPath },
      });
      if (existingFile) continue;
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

      if (!updateThumbnailOnly) {
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

      if (!updateThumbnailOnly) {
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
      fileProcessor.image.delete(newImageThumbnail.name);
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

      if (!updateThumbnailOnly) {
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
            published: 'public',
            // owner
            owner: { connect: { email: 'j.larminay@gmail.com' } },
          },
        });
      }

      // cleanup
      fileProcessor.pdf.delete(documentName);
      count++;
    }

    // add delay of 0.5s
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // console log if needed
  console.log(`Inserted ${count} files`);
  return true;
}
