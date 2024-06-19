import formidable from 'formidable';
import { getServerSession } from '#auth';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

export default defineEventHandler(async (ctx) => {
  const session = await getServerSession(ctx);
  const targetDir = useRuntimeConfig().public.workingTmpFolder as string;

  // create folder if not exists
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
  }

  const form = formidable({
    multiples: true,
    uploadDir: targetDir,
    maxFileSize: 4 * 1024 * 1024 * 1024, // 4GB
    maxTotalFileSize: 4 * 1024 * 1024 * 1024, // 4GB
  });

  return new Promise(async (resolve, reject) => {
    form.parse(ctx.req, (err, fields, files: any) => {
      if (err) {
        console.error('Error parsing form', err);
        reject({ error: err.message });
        return;
      }

      if (!files.video || files.video.length === 0) {
        console.error('No video file uploaded');
        reject({ error: 'No video file uploaded' });
        return;
      }

      const key = Math.random().toString(36).substring(2, 12);
      const targetDir = useRuntimeConfig().public.workingTmpFolder as string;
      const videoFile = files.video[0];

      const newFilePath = `${targetDir}/${key}_${videoFile.originalFilename}`
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-_.\/]/g, '');

      fs.rename(videoFile.filepath, newFilePath, async (err) => {
        if (err) {
          console.error('Error moving file', err);
          reject({ error: err.message });
          return;
        }

        const newVideo = await prisma.video.create({
          data: {
            title: videoFile.originalFilename,
            description: '',
            ownerId: session?.id || 0,
            dateDisplay: '',
            dateOrder: new Date(),
            published: 'private',
            status: 'processing',
          },
        });

        queue.push({
          videoId: newVideo.id,
          key,
          name: videoFile.originalFilename,
          targetVideo: newFilePath,
        });

        resolve({ success: true, filePath: newFilePath });
      });
    });
  });
});
