import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async () => {
  // define seeds
  const newData = [
    {
      name: 'Alex Gerogory',
      birthday: new Date('1982-11-25'),
      gender: 'Female',
    },
    {
      name: 'Billson Smith',
      birthday: new Date('1972-02-13'),
      gender: 'Other',
    },
    {
      name: 'David Michel',
      birthday: new Date('1992-05-23'),
      gender: 'Male',
    },
    {
      name: 'Ippie Jones',
      birthday: new Date('2008-06-14'),
      gender: 'Male',
    },
    {
      name: 'Jessica Jones',
      birthday: new Date('2020-08-07'),
      gender: 'Female',
    },
    {
      name: 'Josh Larminay',
      birthday: new Date('1994-08-09'),
      gender: 'Male',
    },
  ];

  // create seeds
  for (let i = 0; i < newData.length; i++) {
    const currentData = newData[i];

    // insert into db
    await prisma.person.create({
      data: {
        name: currentData.name,
        birthday: currentData.birthday,
        gender: currentData.gender,
      },
    });
  }
  console.log('Insert person: ', newData.length);
};
