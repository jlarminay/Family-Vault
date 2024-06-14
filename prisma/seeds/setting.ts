import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async () => {
  // define seeds
  const newData = [
    {
      key: 'metabaseUrl',
      value: 'http://localhost:4000',
    },
    {
      key: 'metabaseApiKey',
      value: '1234567890',
    },
  ];

  // create seeds
  for (let i = 0; i < newData.length; i++) {
    // insert into db
    await prisma.setting.create({
      data: newData[i],
    });
  }
  console.log('Insert setting: ', newData.length);
};
