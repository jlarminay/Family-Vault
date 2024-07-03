import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async () => {
  // define seeds
  const newData = [
    {
      text: 'This is a good comment',
      itemId: 1,
      userId: 3,
      createdAt: new Date('2023-11-01'),
    },
    {
      text: 'This is a bad comment',
      itemId: 1,
      userId: 4,
      createdAt: new Date('2023-09-26'),
    },
    {
      text: 'This is another comment',
      itemId: 1,
      userId: 4,
      createdAt: new Date('2023-12-22'),
    },
    {
      text: 'This is a comment',
      itemId: 2,
      userId: 5,
    },
    {
      text: 'This is a comment',
      itemId: 2,
      userId: 4,
    },
    {
      text: 'This is a comment',
      itemId: 2,
      userId: 4,
    },
    {
      text: 'This is a comment',
      itemId: 3,
      userId: 5,
    },
    {
      text: 'This is a comment',
      itemId: 3,
      userId: 4,
    },
  ];

  // create seeds
  for (let i = 0; i < newData.length; i++) {
    await prisma.comment.create({
      data: newData[i],
    });
  }
  console.log('Insert comment: ', newData.length);
};
