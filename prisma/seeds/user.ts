import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async () => {
  // define seeds
  const newData = [
    {
      email: 'j.larminay@gmail.com',
      name: 'Josh Larminay',
      provider: 'github',
    },
    {
      email: 'johndoe@email.com',
      name: 'John Doe',
      provider: 'discord',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
    {
      email: 'alicejones@email.com',
      name: 'Alice Jones',
      provider: 'github',
      avatar: 'https://i.pravatar.cc/150?img=45',
    },
    {
      email: 'bannana@email.com',
      name: 'Big Tom',
      provider: 'discord',
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
