import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import S3 from '../../server/utils/s3.js';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();
const s3 = new S3();

export default async () => {
  let count = 0;
  const allFiles = await s3.getAllFiles();

  for (let i = 0; i < allFiles.length; i++) {
    const file = allFiles[i];
    const type = file.contentType.startsWith('video/') ? 'video' : 'image';
    const description = faker.commerce.productDescription();
    const people = Array.from({ length: Math.floor(Math.random() * 5) }, () =>
      faker.person.firstName(),
    ).join(', ');
    const dateOrder =
      i === 0
        ? dayjs().toDate()
        : dayjs()
            .subtract(Math.floor(Math.random() * 400) + 1, 'day')
            .toDate();
    const createdAt =
      i === 0
        ? dayjs().toDate()
        : dayjs()
            .subtract(Math.floor(Math.random() * 400) + 1, 'day')
            .toDate();
    const files =
      type === 'video'
        ? [{ path: file.fullPath }, { path: `${file.fullPath}.thumbnail.webp` }]
        : [{ path: file.fullPath }];

    await prisma.item.create({
      data: {
        type: type,
        description: description,
        people: people,
        dateOrder: dateOrder,
        ownerId: 3,
        published: 'public',
        file: {
          connect: files,
        },
        createdAt: createdAt,
      },
    });

    count++;
  }

  console.log('Insert video: ', count);
};
