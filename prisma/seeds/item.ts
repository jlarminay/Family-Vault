import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async () => {
  // define seeds
  const newData = [
    {
      type: 'video',
      description: 'This is a video',
      people: 'John',
      dateOrder: new Date('2010-04-05'),
      ownerId: 3,
      published: 'public',
      file: [1, 2],
    },
    {
      type: 'video',
      description: 'This is a video',
      people: 'John',
      dateOrder: new Date('2010-04-05'),
      ownerId: 3,
      published: 'public',
      file: [3, 4],
    },
    {
      type: 'video',
      description: 'This is a video',
      people: 'John',
      dateOrder: new Date('2010-04-05'),
      ownerId: 3,
      published: 'public',
      file: [5, 6],
    },
    {
      type: 'video',
      description: 'This is a video',
      people: 'John',
      dateOrder: new Date('2010-04-05'),
      ownerId: 3,
      published: 'public',
      file: [7, 8],
    },
    {
      type: 'video',
      description: 'This is a video',
      people: 'John',
      dateOrder: new Date('2010-04-05'),
      ownerId: 3,
      published: 'public',
      file: [9, 10],
    },
    {
      type: 'video',
      description: 'This is a video',
      people: 'John',
      dateOrder: new Date('2010-04-05'),
      ownerId: 3,
      published: 'public',
      file: [11, 12],
    },
    {
      type: 'video',
      description: 'This is a video',
      people: 'John',
      dateOrder: new Date('2010-04-05'),
      ownerId: 3,
      published: 'public',
      file: [13, 14],
    },
    {
      type: 'image',
      description: 'This is a video',
      people: 'John',
      dateOrder: new Date('2010-04-05'),
      ownerId: 3,
      published: 'public',
      file: [15],
    },
    {
      type: 'image',
      description: 'This is a video',
      people: 'John',
      dateOrder: new Date('2010-04-05'),
      ownerId: 3,
      published: 'public',
      file: [16],
    },
    {
      type: 'image',
      description: 'This is a video',
      people: 'John',
      dateOrder: new Date('2010-04-05'),
      ownerId: 3,
      published: 'public',
      file: [17],
    },
    {
      type: 'image',
      description: 'This is a video',
      people: 'John',
      dateOrder: new Date('2010-04-05'),
      ownerId: 3,
      published: 'public',
      file: [18],
    },
    {
      type: 'image',
      description: 'This is a video',
      people: 'John',
      dateOrder: new Date('2010-04-05'),
      ownerId: 3,
      published: 'public',
      file: [19],
    },
    {
      type: 'image',
      description: 'This is a video',
      people: 'John',
      dateOrder: new Date('2010-04-05'),
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
      },
    });
  }
  console.log('Insert video: ', newData.length);
};
