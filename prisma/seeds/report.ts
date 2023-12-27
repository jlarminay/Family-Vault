import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async () => {
  // define seeds
  const newData = [
    {
      report: 'This video is very inappropriate.',
      userId: 1,
      videoId: 1,
    },
    {
      report: 'This video is very inappropriate also.',
      userId: 2,
      videoId: 2,
    },
  ];

  // create seeds
  for (let i = 0; i < newData.length; i++) {
    await prisma.report.create({
      data: newData[i],
    });
  }
  console.log('Insert report: ', newData.length);
};
