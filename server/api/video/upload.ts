import multer from 'multer';
import { getServerSession } from '#auth';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const targetDir = useRuntimeConfig().public.workingTmpFolder as string;
    // create folder if not exists
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    const key = Math.random().toString(36).substring(2, 12);
    const fileName = `${key}_${file.originalname
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-_.\/]/g, '')}`;
    cb(null, fileName);
  },
});

// Multer upload options
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 * 1024, // 10GB
    files: 1, // Only allow one file at a time
  },
});

export default defineEventHandler(async (ctx) => {
  const session = await getServerSession(ctx);

  const request = ctx.node.req as any;
  const response = ctx.node.res as any;

  return new Promise((resolve, reject) => {
    upload.single('video')(request, response, async (err) => {
      if (err) {
        console.error('Error uploading file', err);
        reject({ error: 'Error uploading file' });
        return;
      }

      if (!request.file) {
        console.error('No video file uploaded');
        reject({ error: 'No video file uploaded' });
        return;
      }

      const newFilePath = request.file.path;
      const originalFilename = request.file.originalname;

      try {
        const newVideo = await prisma.video.create({
          data: {
            title: originalFilename,
            description: '',
            ownerId: session?.id || 0,
            dateDisplay: '',
            dateOrder: new Date(),
            published: 'private',
            status: 'processing',
          },
        });

        // create json file of metadata
        const jsonFilePath = newFilePath.replace(/\.[^/.]+$/, '.json');
        fs.writeFileSync(
          jsonFilePath,
          JSON.stringify({
            videoId: newVideo.id,
            name: originalFilename,
            targetVideo: newFilePath.replace('\\', '/'),
          }),
        );

        resolve({ success: true, filePath: newFilePath });
      } catch (error) {
        console.error('Error creating video record', error);
        reject({ error: 'Error creating video record' });
      } finally {
        prisma.$disconnect();
      }
    });
  });
});
