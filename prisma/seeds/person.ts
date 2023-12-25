import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async () => {
  // define seeds
  const newData = [
    {
      name: 'Josh Larminay',
      birthday: '1994-08-09',
      gender: 'Male',
      userId: 1,
    },
    {
      name: 'Latarrah Kremler',
      birthday: '1992-05-23',
      gender: 'Female',
      userId: null,
    },
  ];

  // create seeds
  for (let i = 0; i < newData.length; i++) {
    await prisma.person.create({
      data: newData[i],
    });
  }
  console.log('Insert comment: ', newData.length);
};
