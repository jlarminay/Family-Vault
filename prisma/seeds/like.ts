import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async () => {
  // define seeds
  const newData = [
    {
      userId: 3,
      itemId: 1,
    },
    {
      userId: 4,
      itemId: 1,
    },
    {
      userId: 5,
      itemId: 2,
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
