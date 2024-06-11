import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async () => {
  // define seeds
  const newData = [
    {
      name: 'Placeholder',
      description: 'This is a placeholder collection',
      videos: {
        connect: [{ id: 1 }, { id: 2 }, { id: 3 }],
      },
    },
    {
      name: 'Another One',
      description: 'This is a placeholder collection',
      videos: {
        connect: [{ id: 3 }, { id: 4 }, { id: 5 }],
      },
    },
    {
      name: 'Empty Collection',
      description: 'This is a placeholder collection',
    },
  ];

  // create seeds
  for (let i = 0; i < newData.length; i++) {
    // insert into db
    await prisma.collection.create({
      data: newData[i],
    });
  }
  console.log('Insert collection: ', newData.length);
};
