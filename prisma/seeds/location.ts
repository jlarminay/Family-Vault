import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

export default async () => {
  let count = 0;

  // create seeds
  for (let i = 0; i < 10; i++) {
    // insert into db
    await prisma.location.create({
      data: {
        name: Math.random() < 0.5 ? faker.location.city() : null,
        latLong: `${faker.location.latitude()}, ${faker.location.longitude()}`,
        city: faker.location.city(),
        country: faker.location.country(),
      },
    });

    count++;
  }
  console.log('Insert location: ', count);
};
