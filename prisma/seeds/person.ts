import { PrismaClient } from '@prisma/client';
import S3 from '../../server/utils/s3.js';
import { resolve } from 'path';
import { createReadStream } from 'fs';

const prisma = new PrismaClient();
const s3 = new S3();

export default async () => {
  // define seeds
  const newData = [
    {
      name: 'Josh Larminay',
      birthday: new Date('1994-08-09'),
      gender: 'Male',
      image: './images/josh-larminay.webp',
      userId: 1,
    },
    {
      name: 'David Michel',
      birthday: new Date('1992-05-23'),
      gender: 'Male',
      image: './images/david-michel.webp',
    },
    {
      name: 'Alex Gerogory',
      birthday: new Date('1982-11-25'),
      gender: 'Female',
      image: './images/alex-gerogory.webp',
    },
    {
      name: 'Billson Smith',
      birthday: new Date('1972-02-13'),
      gender: 'Other',
      image: './images/billson-smith.webp',
    },
    {
      name: 'Ippie Jones',
      birthday: new Date('2008-06-14'),
      gender: 'Male',
      image: './images/ippie-jones.webp',
    },
    {
      name: 'Jessica Jones',
      birthday: new Date('2020-08-07'),
      gender: 'Female',
      image: './images/jessica-jones.webp',
    },
  ];

  // create seeds
  for (let i = 0; i < newData.length; i++) {
    const currentData = newData[i];

    // upload image to s3
    const randomString = Math.random().toString(16).slice(2);
    const imageName = `${randomString}_${currentData.image.split('/').pop()}`;
    const imageData = createReadStream(resolve('./prisma/seeds/' + currentData.image));
    await s3.upload({ key: `persons/${imageName}`, body: imageData });

    // insert into db
    await prisma.person.create({
      data: {
        name: currentData.name,
        birthday: currentData.birthday,
        gender: currentData.gender,
        image: `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/persons/${imageName}`,
      },
    });
  }
  console.log('Insert person: ', newData.length);
};
