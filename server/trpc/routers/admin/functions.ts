import { adminProcedure } from '@/server/trpc/trpc';
import { checkFileChanges } from '@/server/utils/checkFileChanges';
import { PrismaClient } from '@prisma/client';
import S3 from '@/server/utils/s3';

async function setEndAverage(prisma: PrismaClient, startTime: Date, key: string) {
  // get end time
  const endTime = new Date();
  const diff = (endTime.getTime() - startTime.getTime()) / 1000; // in seconds

  // update average
  const currentAvg = await prisma.setting.findFirst({
    where: { key: key },
  });
  const newAvg = (parseInt(currentAvg?.value || '0') + diff) / 2;

  // set new average
  await prisma.setting.upsert({
    where: { key: key },
    update: { value: newAvg.toString() },
    create: { key: key, value: newAvg.toString() },
  });
}

export default {
  getAllFiles: adminProcedure.query(async ({ ctx }) => {
    try {
      const start = new Date();

      // do function
      const s3Instance = S3.getInstance({
        region: useRuntimeConfig().s3.region || '',
        endpoint: useRuntimeConfig().s3.endpoint || '',
        accessKeyId: useRuntimeConfig().s3.accessKey || '',
        secretAccessKey: useRuntimeConfig().s3.secretKey || '',
      });
      const results = await s3Instance.getAllFiles();

      await setEndAverage(ctx.prisma, start, 'timerGetAllFiles');
      return results;
    } catch (error) {
      return error;
    }
  }),

  forceRecheckS3Bucket: adminProcedure.query(async ({ ctx }) => {
    try {
      const start = new Date();

      const results = await checkFileChanges();

      await setEndAverage(ctx.prisma, start, 'timerForceRecheckS3Bucket');
      return results;
    } catch (error) {
      return error;
    }
  }),

  recreateAllThumbnails: adminProcedure.query(async ({ ctx }) => {
    try {
      const start = new Date();

      const results = await checkFileChanges({ updateThumbnailOnly: true });

      await setEndAverage(ctx.prisma, start, 'timerRecreateAllThumbnails');
      return results;
    } catch (error) {
      return error;
    }
  }),

  updatePermissions: adminProcedure.query(async ({ ctx }) => {
    try {
      const start = new Date();

      const s3Instance = S3.getInstance({
        region: useRuntimeConfig().s3.region || '',
        endpoint: useRuntimeConfig().s3.endpoint || '',
        accessKeyId: useRuntimeConfig().s3.accessKey || '',
        secretAccessKey: useRuntimeConfig().s3.secretKey || '',
      });
      const allFiles = await s3Instance.getAllFiles(true);

      // update permissions
      for (const file of allFiles) {
        const { key } = file;
        console.log('updating permissions for', key);
        await s3Instance.updateFilePermissions(key);
      }

      await setEndAverage(ctx.prisma, start, 'timerUpdatePermissions');

      return allFiles.length;
    } catch (error) {
      return error;
    }
  }),
};
