import { PrismaClient } from '@prisma/client';
import S3 from '../../server/utils/s3.js';

const prisma = new PrismaClient();
const s3 = new S3();

export default async () => {
  // define seeds
  const newData = [
    {
      userId: 2,
      videoId: 1,
    },
    {
      userId: 3,
      videoId: 1,
    },
    {
      userId: 4,
      videoId: 2,
    },
  ];

  // create seeds
  for (let i = 0; i < newData.length; i++) {
    // insert into db
    await prisma.like.create({
      data: newData[i],
    });
  }
  console.log('Insert like: ', newData.length);
};
