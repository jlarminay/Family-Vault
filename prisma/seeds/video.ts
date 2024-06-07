import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async () => {
  // define seeds
  const newData = [
    {
      title: 'Video #1',
      description: 'Description #1',
      dateDisplay: '~Jan 2021',
      dateOrder: new Date('2021-01-01'),
      ownerId: 1,
      videoId: 1,
      thumbnailId: 2,
      published: true,
      persons: [{ id: 1 }, { id: 2 }, { id: 3 }],
    },
    {
      title: 'This is a really really good video with a very very long title',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mi ipsum faucibus vitae aliquet. Consectetur purus ut faucibus pulvinar elementum integer enim neque. Etiam non quam lacus suspendisse faucibus interdum. Placerat duis ultricies lacus sed turpis tincidunt id aliquet. Elit at imperdiet dui accumsan sit amet. Risus sed vulputate odio ut. Blandit massa enim nec dui nunc mattis enim ut tellus. Volutpat lacus laoreet non curabitur gravida arcu ac tortor dignissim. Tempor nec feugiat nisl pretium fusce. Purus faucibus ornare suspendisse sed nisi lacus sed viverra tellus. Varius quam quisque id diam vel quam elementum. Adipiscing elit pellentesque habitant morbi. Proin fermentum leo vel orci porta. Quam viverra orci sagittis eu volutpat odio facilisis. Sodales neque sodales ut etiam sit amet nisl. Sed risus pretium quam vulputate. Quam viverra orci sagittis eu volutpat.',
      dateDisplay: 'August 21, 2022',
      dateOrder: new Date('2022-08-21'),
      ownerId: 1,
      videoId: 3,
      thumbnailId: 4,
      published: true,
      persons: [{ id: 2 }, { id: 5 }],
    },
    {
      title: 'Other User Unpublished',
      description:
        'Experience the enchantment of spinning in our latest video demo! From graceful dancers to vibrant swirls of color, witness the captivating beauty of continuous motion. Let the simple yet stunning artistry of spinning mesmerize you in this visual spectacle.',
      dateDisplay: 'Jan 1 - Feb 22 2020',
      dateOrder: new Date('2020-01-01'),
      ownerId: 2,
      videoId: 5,
      thumbnailId: 6,
      published: false,
    },
    {
      title: 'Other User Published',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      dateDisplay: 'November 1995',
      dateOrder: new Date('1995-11-01'),
      ownerId: 1,
      videoId: 7,
      thumbnailId: 8,
      published: true,
    },
    {
      title: '4:3 video format',
      description:
        'This video is in a 4:3 video format. Just to see what it would look like and how it would act.',
      dateDisplay: 'Unknown',
      dateOrder: new Date('2000-01-01'),
      ownerId: 1,
      videoId: 9,
      thumbnailId: 10,
      published: true,
    },
    {
      title: 'This is a very tall video',
      description:
        'This is a very tall video filled with my phone. To see how a large video would look on the site. If you listen closely, you can hear my little cat, Rusty, purring in the background. He is a very good cat.',
      dateDisplay: 'June 2, 2024',
      dateOrder: new Date('2024-06-02'),
      ownerId: 1,
      videoId: 11,
      thumbnailId: 12,
      published: true,
    },
    {
      title: 'My video is not published!',
      description:
        'This is a video i own, but i never published it!!! I am not sure why, but i just never did. I think it is because i am a little shy. But i am going to publish it now!',
      dateDisplay: 'March 1, 2022',
      dateOrder: new Date('2022-03-01'),
      ownerId: 1,
      videoId: 13,
      thumbnailId: 14,
      published: false,
    },
  ];

  // create seeds
  for (let i = 0; i < newData.length; i++) {
    // insert to db
    await prisma.video.create({
      data: {
        title: newData[i].title,
        description: newData[i].description,
        dateDisplay: newData[i].dateDisplay,
        dateOrder: newData[i].dateOrder,
        videoId: newData[i].videoId,
        thumbnailId: newData[i].thumbnailId,
        ownerId: newData[i].ownerId,
        published: newData[i].published,
        persons: {
          connect: newData[i].persons ? newData[i].persons : undefined,
        },
      },
    });
  }
  console.log('Insert video: ', newData.length);
};
