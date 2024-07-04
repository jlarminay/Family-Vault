import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

export default async () => {
  // define seeds
  const newData = [
    {
      type: 'video',
      description: faker.commerce.productDescription(),
      people: `${faker.person.firstName()}, ${faker.person.firstName()}`,
      dateOrder: dayjs().toDate(), // today
      createdAt: dayjs().toDate(), // today
      ownerId: 3,
      published: 'public',
      file: [1, 2],
    },
    {
      type: 'video',
      description: faker.commerce.productDescription(),
      people: `${faker.person.firstName()}, ${faker.person.firstName()}, ${faker.person.firstName()}`,
      dateOrder: dayjs().toDate(), // today
      createdAt: dayjs().subtract(1, 'day').toDate(), // yesterday
      ownerId: 3,
      published: 'public',
      file: [3, 4],
    },
    {
      type: 'video',
      description: faker.commerce.productDescription(),
      people: `${faker.person.firstName()}`,
      dateOrder: dayjs().subtract(1, 'day').toDate(), // yesterday
      createdAt: dayjs().subtract(1, 'day').toDate(), // yesterday

      ownerId: 3,
      published: 'public',
      file: [5, 6],
    },
    {
      type: 'video',
      description: '',
      people: '',
      dateOrder: dayjs().subtract(1, 'day').toDate(), // yesterday
      createdAt: dayjs().subtract(1, 'day').toDate(), // yesterday
      ownerId: 3,
      published: 'public',
      file: [7, 8],
    },
    {
      type: 'video',
      description: faker.commerce.productDescription(),
      people: '',
      dateOrder: dayjs().subtract(20, 'day').toDate(), // 20 days ago
      createdAt: dayjs().subtract(10, 'day').toDate(), // 10 days ago
      ownerId: 3,
      published: 'public',
      file: [9, 10],
    },
    {
      type: 'video',
      description: faker.commerce.productDescription(),
      people: `${faker.person.firstName()}, ${faker.person.firstName()}`,
      dateOrder: dayjs().subtract(60, 'day').toDate(), // 60 days ago
      createdAt: dayjs().subtract(30, 'day').toDate(), // 30 days ago
      ownerId: 3,
      published: 'public',
      file: [11, 12],
    },
    {
      type: 'video',
      description: '',
      people: '',
      dateOrder: dayjs()
        .subtract(Math.floor(Math.random() * 640) + 360, 'day')
        .toDate(), // 360 - 1000 days ago
      createdAt: dayjs()
        .subtract(Math.floor(Math.random() * 640) + 360, 'day')
        .toDate(), // 360 - 1000 days ago
      ownerId: 3,
      published: 'public',
      file: [13, 14],
    },
    {
      type: 'image',
      description: faker.commerce.productDescription(),
      people: `${faker.person.firstName()}, ${faker.person.firstName()}, ${faker.person.firstName()}, ${faker.person.firstName()}, ${faker.person.firstName()}`,
      dateOrder: dayjs()
        .subtract(Math.floor(Math.random() * 640) + 360, 'day')
        .toDate(), // 360 - 1000 days ago
      createdAt: dayjs()
        .subtract(Math.floor(Math.random() * 640) + 360, 'day')
        .toDate(), // 360 - 1000 days ago
      ownerId: 3,
      published: 'public',
      file: [15],
    },
    {
      type: 'image',
      description: faker.commerce.productDescription(),
      people: `${faker.person.firstName()}, ${faker.person.firstName()}`,
      dateOrder: dayjs()
        .subtract(Math.floor(Math.random() * 640) + 360, 'day')
        .toDate(), // 360 - 1000 days ago
      createdAt: dayjs()
        .subtract(Math.floor(Math.random() * 640) + 360, 'day')
        .toDate(), // 360 - 1000 days ago
      ownerId: 3,
      published: 'public',
      file: [16],
    },
    {
      type: 'image',
      description: faker.commerce.productDescription(),
      people: '',
      dateOrder: dayjs()
        .subtract(Math.floor(Math.random() * 640) + 360, 'day')
        .toDate(), // 360 - 1000 days ago
      createdAt: dayjs()
        .subtract(Math.floor(Math.random() * 640) + 360, 'day')
        .toDate(), // 360 - 1000 days ago
      ownerId: 3,
      published: 'public',
      file: [17],
    },
    {
      type: 'image',
      description: '',
      people: '',
      dateOrder: dayjs()
        .subtract(Math.floor(Math.random() * 640) + 360, 'day')
        .toDate(), // 360 - 1000 days ago
      createdAt: dayjs()
        .subtract(Math.floor(Math.random() * 640) + 360, 'day')
        .toDate(), // 360 - 1000 days ago
      ownerId: 3,
      published: 'public',
      file: [18],
    },
    {
      type: 'image',
      description: '',
      people: '',
      dateOrder: dayjs()
        .subtract(Math.floor(Math.random() * 640) + 360, 'day')
        .toDate(), // 360 - 1000 days ago
      createdAt: dayjs()
        .subtract(Math.floor(Math.random() * 640) + 360, 'day')
        .toDate(), // 360 - 1000 days ago
      ownerId: 3,
      published: 'public',
      file: [19],
    },
    {
      type: 'image',
      description: '',
      people: `${faker.person.firstName()}, ${faker.person.firstName()}`,
      // random day dayjs
      dateOrder: dayjs()
        .subtract(Math.floor(Math.random() * 640) + 360, 'day')
        .toDate(), // 360 - 1000 days ago
      createdAt: dayjs()
        .subtract(Math.floor(Math.random() * 640) + 360, 'day')
        .toDate(), // 360 - 1000 days ago
      ownerId: 3,
      published: 'public',
      file: [20],
    },
  ];

  // create seeds
  for (let i = 0; i < newData.length; i++) {
    // insert to db
    await prisma.item.create({
      data: {
        type: newData[i].type,
        description: newData[i].description,
        people: newData[i].people,
        dateOrder: newData[i].dateOrder,
        ownerId: newData[i].ownerId,
        published: newData[i].published,
        file: {
          connect: newData[i].file.map((id) => ({ id })),
        },
        createdAt: newData[i].createdAt,
      },
    });
  }
  console.log('Insert video: ', newData.length);
};
