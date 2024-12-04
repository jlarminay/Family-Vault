import { adminProcedure } from '@/server/trpc/trpc';
import { checkFileChanges, getAllFiles, updatePermissions } from '@/server/utils/checkFileChanges';
import { PrismaClient } from '@prisma/client';

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

      const allFiles = await getAllFiles();

      await setEndAverage(ctx.prisma, start, 'timerGetAllFiles');
      return allFiles;
    } catch (error) {
      return error;
    }
  }),

  forceRecheckS3Bucket: adminProcedure.query(async ({ ctx }) => {
    try {
      const start = new Date();

      const allFiles = await getAllFiles();
      const results = await checkFileChanges(allFiles);

      await setEndAverage(ctx.prisma, start, 'timerForceRecheckS3Bucket');
      return results;
    } catch (error) {
      return error;
    }
  }),

  getMissingThumbnails: adminProcedure.query(async ({ ctx }) => {
    try {
      const start = new Date();

      const allFiles = await getAllFiles();
      const results = await checkFileChanges(allFiles, { missingThumbnail: true });

      await setEndAverage(ctx.prisma, start, 'timerGetMissingThumbnails');
      return results;
    } catch (error) {
      return error;
    }
  }),

  recreateAllThumbnails: adminProcedure.query(async ({ ctx }) => {
    try {
      const start = new Date();

      const allFiles = await getAllFiles();
      const results = await checkFileChanges(allFiles, { newThumbnails: true });

      await setEndAverage(ctx.prisma, start, 'timerRecreateAllThumbnails');
      return results;
    } catch (error) {
      return error;
    }
  }),

  updatePermissions: adminProcedure.query(async ({ ctx }) => {
    try {
      const start = new Date();

      const allFiles = await getAllFiles(true);
      const results = await updatePermissions(allFiles);

      await setEndAverage(ctx.prisma, start, 'timerUpdatePermissions');

      return results;
    } catch (error) {
      return error;
    }
  }),
};
