import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async () => {
  // define seeds
  const newData = [
    {
      email: 'test@email.com',
      name: 'Test Account',
      provider: 'credentials',
      avatar: 'https://placehold.co/500/973cd2/fff?text=Test+Account',
      role: 'admin',
    },
    {
      email: 'j.larminay@gmail.com',
      name: 'Josh Larminay',
      provider: 'github',
      avatar: 'https://avatars.githubusercontent.com/u/10368000?v=4',
      role: 'admin',
    },
    {
      email: 'johndoe@email.com',
      name: 'John Doe',
      provider: 'discord',
      avatar: 'https://i.pravatar.cc/150?img=12',
      role: 'user',
    },
    {
      email: 'alicejones@email.com',
      name: 'Alice Jones',
      provider: 'github',
      avatar: 'https://i.pravatar.cc/150?img=45',
      role: 'user',
    },
    {
      email: 'bannana@email.com',
      name: 'Big Tom',
      provider: 'google',
      avatar: 'https://i.pravatar.cc/150?img=31',
      role: 'user',
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
