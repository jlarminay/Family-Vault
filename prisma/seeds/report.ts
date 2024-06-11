import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async () => {
  // define seeds
  const newData = [
    {
      report: 'This video is very inappropriate.',
      userId: 4,
      videoId: 1,
    },
    {
      report: 'This video is very inappropriate also.',
      userId: 5,
      videoId: 3,
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
