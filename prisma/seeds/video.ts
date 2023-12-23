import { PrismaClient } from '@prisma/client';

export default async (prisma: PrismaClient) => {
  // define seeds
  const newData = [
    {
      title: 'Video #1',
      description: 'Description #1',
      url: 'https://www.youtube.com/watch?v=1',
      thumbnail: 'https://i.ytimg.com/vi/1/mqdefault.jpg',
      duration: 100,
    },
    {
      title: 'Awesome demo video',
      description: 'Description #2',
      url: 'https://www.youtube.com/watch?v=2',
      duration: 200,
    },
    {
      title: 'This is a really good video with a very long title',
      description: 'Description #3',
      url: 'https://www.youtube.com/watch?v=3',
      duration: 5632,
    },
  ];

  // create seeds
  for (let i = 0; i < newData.length; i++) {
    await prisma.video.create({
      data: newData[i],
    });
  }
};
