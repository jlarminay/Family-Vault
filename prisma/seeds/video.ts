import { PrismaClient } from '@prisma/client';
// import ffmpeg from 'fluent-ffmpeg';

// import Demo1 from './videos/demo1.mp4';
// import Demo2 from './videos/demo2.mp4';
// import Demo3 from './videos/demo3.mp4';

export default async (prisma: PrismaClient, s3: any) => {
  // define seeds
  const newData = [
    {
      title: 'Video #1',
      description: 'Description #1',
      url: 'http://localhost:9444/ui/videos/demo2.mp4',
      duration: 55,
    },
    {
      title: 'The Whole Wide World',
      description:
        'Experience the enchantment of spinning in our latest video demo! From graceful dancers to vibrant swirls of color, witness the captivating beauty of continuous motion. Let the simple yet stunning artistry of spinning mesmerize you in this visual spectacle.',
      url: 'http://localhost:9444/ui/videos/demo.mp4',
      thumbnail: 'http://localhost:9444/ui/videos/demo.png',
      duration: 30,
    },
    {
      title: 'This is a really good video with a very long title',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mi ipsum faucibus vitae aliquet. Consectetur purus ut faucibus pulvinar elementum integer enim neque. Etiam non quam lacus suspendisse faucibus interdum. Placerat duis ultricies lacus sed turpis tincidunt id aliquet. Elit at imperdiet dui accumsan sit amet. Risus sed vulputate odio ut. Blandit massa enim nec dui nunc mattis enim ut tellus. Volutpat lacus laoreet non curabitur gravida arcu ac tortor dignissim. Tempor nec feugiat nisl pretium fusce. Purus faucibus ornare suspendisse sed nisi lacus sed viverra tellus. Varius quam quisque id diam vel quam elementum. Adipiscing elit pellentesque habitant morbi. Proin fermentum leo vel orci porta. Quam viverra orci sagittis eu volutpat odio facilisis. Sodales neque sodales ut etiam sit amet nisl. Sed risus pretium quam vulputate. Quam viverra orci sagittis eu volutpat.',
      url: 'https://www.youtube.com/watch?v=3',
      duration: 5632,
    },
  ];

  // create seeds
  for (let i = 0; i < newData.length; i++) {
    // manage video
    // upload video and thumbnail
    // insert to db
    const tmp = {
      ...newData[i],
      // url: '',
      // thumbnail: '',
      // duration: 0,
    };
    await prisma.video.create({
      data: tmp,
    });
  }
  console.log('Insert video: ', newData.length);
};
