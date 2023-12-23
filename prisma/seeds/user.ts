import { type PrismaClient } from '@prisma/client';

export default async (prisma: PrismaClient) => {
  // define seeds
  const newData = [
    {
      email: 'josh@email.com',
      name: 'Josh Larminay',
      avatar: 'https://i.pravatar.cc/150?img=58',
    },
    {
      email: 'johndoe@email.com',
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
    {
      email: 'alicejones@email.com',
      name: 'Alice Jones',
      avatar: 'https://i.pravatar.cc/150?img=45',
    },
    {
      email: 'bannana@email.com',
      name: 'Big Tom',
      avatar: 'https://i.pravatar.cc/150?img=31',
    },
  ];

  // create seeds
  for (let i = 0; i < newData.length; i++) {
    await prisma.user.create({
      data: newData[i],
    });
  }
  console.log('Insert user: ', newData.length);
};
