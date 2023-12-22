import { PrismaClient } from '@prisma/client';

export default async (prisma: PrismaClient) => {
  // define seeds
  const newData = [
    {
      email: 'josh@email.com',
      name: 'Josh',
    },
  ];

  // create seeds
  for (let i = 0; i < newData.length; i++) {
    await prisma.user.create({
      data: newData[i],
    });
  }
};
