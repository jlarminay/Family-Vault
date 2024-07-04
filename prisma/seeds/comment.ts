import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';

const prisma = new PrismaClient();

export default async () => {
  // define seeds
  const newData = [
    {
      text: 'This is a good comment',
      itemId: 1,
      userId: 3,
      createdAt: dayjs().subtract(1, 'day').toDate(),
    },
    {
      text: 'This is a bad comment',
      itemId: 1,
      userId: 4,
      createdAt: dayjs().subtract(2, 'day').toDate(),
    },
    {
      text: faker.person.jobDescriptor(),
      itemId: 1,
      userId: 4,
      createdAt: dayjs().subtract(10, 'day').toDate(),
    },
    {
      text: faker.person.jobDescriptor(),
      itemId: 2,
      userId: 5,
      createdAt: dayjs().subtract(20, 'day').toDate(),
    },
    {
      text: faker.person.jobDescriptor(),
      itemId: 2,
      userId: 4,
      createdAt: dayjs().subtract(10, 'day').toDate(),
    },
    {
      text: faker.person.jobDescriptor(),
      itemId: 2,
      userId: 4,
      createdAt: dayjs().subtract(2, 'day').toDate(),
    },
    {
      text: faker.commerce.productDescription(),
      itemId: 3,
      userId: 5,
      createdAt: dayjs().subtract(1, 'day').toDate(),
    },
    {
      text: faker.commerce.productDescription(),
      itemId: 3,
      userId: 4,
      createdAt: dayjs().toDate(),
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
