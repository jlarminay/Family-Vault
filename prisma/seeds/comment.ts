import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async () => {
  // define seeds
  const newData = [
    {
      text: 'This is a good comment',
      videoId: 1,
      userId: 1,
      createdAt: new Date('2023-11-01'),
    },
    {
      text: 'This is a bad comment',
      videoId: 1,
      userId: 2,
      createdAt: new Date('2023-09-26'),
    },
    {
      text: 'This is another comment',
      videoId: 1,
      userId: 2,
      createdAt: new Date('2023-12-22'),
    },
    {
      text: 'This is a comment',
      videoId: 2,
      userId: 3,
    },
    {
      text: 'This is a comment',
      videoId: 2,
      userId: 2,
    },
    {
      text: 'This is a comment',
      videoId: 2,
      userId: 2,
    },
    {
      text: 'This is a comment',
      videoId: 3,
      userId: 3,
    },
    {
      text: 'This is a comment',
      videoId: 3,
      userId: 2,
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
