import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async () => {
  // define seeds
  const newData = [
    {
      title: 'Video #1',
      description: 'Description #1',
      ownerId: 1,
      videoId: 1,
      thumbnailId: 2,
      persons: [{ id: 1 }, { id: 2 }, { id: 3 }],
    },
    {
      title: 'The Whole Wide World',
      description:
        'Experience the enchantment of spinning in our latest video demo! From graceful dancers to vibrant swirls of color, witness the captivating beauty of continuous motion. Let the simple yet stunning artistry of spinning mesmerize you in this visual spectacle.',
      ownerId: 1,
      videoId: 3,
      thumbnailId: 4,
      persons: [{ id: 2 }, { id: 5 }],
    },
    {
      title: 'This is a really good video with a very long title',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mi ipsum faucibus vitae aliquet. Consectetur purus ut faucibus pulvinar elementum integer enim neque. Etiam non quam lacus suspendisse faucibus interdum. Placerat duis ultricies lacus sed turpis tincidunt id aliquet. Elit at imperdiet dui accumsan sit amet. Risus sed vulputate odio ut. Blandit massa enim nec dui nunc mattis enim ut tellus. Volutpat lacus laoreet non curabitur gravida arcu ac tortor dignissim. Tempor nec feugiat nisl pretium fusce. Purus faucibus ornare suspendisse sed nisi lacus sed viverra tellus. Varius quam quisque id diam vel quam elementum. Adipiscing elit pellentesque habitant morbi. Proin fermentum leo vel orci porta. Quam viverra orci sagittis eu volutpat odio facilisis. Sodales neque sodales ut etiam sit amet nisl. Sed risus pretium quam vulputate. Quam viverra orci sagittis eu volutpat.',
      ownerId: 1,
      videoId: 5,
      thumbnailId: 6,
    },
  ];

  // create seeds
  for (let i = 0; i < newData.length; i++) {
    // insert to db
    await prisma.video.create({
      data: {
        title: newData[i].title,
        description: newData[i].description,
        videoId: newData[i].videoId,
        thumbnailId: newData[i].thumbnailId,
        ownerId: newData[i].ownerId,
        persons: {
          connect: newData[i].persons ? newData[i].persons : undefined,
        },
      },
    });
  }
  console.log('Insert video: ', newData.length);
};
