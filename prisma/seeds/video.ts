import { PrismaClient } from '@prisma/client';
import S3 from '../../server/utils/s3.js';
import VideoProcessor from '../../server/utils/videoProcessor.js';
import { resolve } from 'path';
import { createReadStream } from 'fs';
// import ffmpeg from 'fluent-ffmpeg';

const prisma = new PrismaClient();
const s3 = new S3();

export default async () => {
  // define seeds
  const newData = [
    {
      title: 'Video #1',
      description: 'Description #1',
      video: './videos/demo1.mp4',
      ownerId: 1,
    },
    {
      title: 'The Whole Wide World',
      description:
        'Experience the enchantment of spinning in our latest video demo! From graceful dancers to vibrant swirls of color, witness the captivating beauty of continuous motion. Let the simple yet stunning artistry of spinning mesmerize you in this visual spectacle.',
      video: './videos/demo2.mp4',
      ownerId: 1,
    },
    {
      title: 'This is a really good video with a very long title',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mi ipsum faucibus vitae aliquet. Consectetur purus ut faucibus pulvinar elementum integer enim neque. Etiam non quam lacus suspendisse faucibus interdum. Placerat duis ultricies lacus sed turpis tincidunt id aliquet. Elit at imperdiet dui accumsan sit amet. Risus sed vulputate odio ut. Blandit massa enim nec dui nunc mattis enim ut tellus. Volutpat lacus laoreet non curabitur gravida arcu ac tortor dignissim. Tempor nec feugiat nisl pretium fusce. Purus faucibus ornare suspendisse sed nisi lacus sed viverra tellus. Varius quam quisque id diam vel quam elementum. Adipiscing elit pellentesque habitant morbi. Proin fermentum leo vel orci porta. Quam viverra orci sagittis eu volutpat odio facilisis. Sodales neque sodales ut etiam sit amet nisl. Sed risus pretium quam vulputate. Quam viverra orci sagittis eu volutpat.',
      video: './videos/demo3.mp4',
      ownerId: 1,
    },
  ];

  // create seeds
  for (let i = 0; i < newData.length; i++) {
    // manage video
    const randomString = Math.random().toString(16).slice(2);
    const video = newData[i].video;
    const videoName = `${randomString}_${video.split('/').pop()}`;
    const imageName = videoName.replace('.mp4', '.webp');

    // get metadata
    const processing = new VideoProcessor('./prisma/seeds/' + video);
    const { duration, resolution, size } = await processing.getMetadata();
    await processing.getThumbnailAt({ time: '00:00:00', filename: imageName });

    // upload video and thumbnail
    const videoStream = createReadStream(resolve('./prisma/seeds/' + video));
    await s3.upload({ key: videoName, body: videoStream });
    const imageData = createReadStream(resolve('./.tmp/' + imageName));
    await s3.upload({ key: imageName, body: imageData });

    // insert to db
    await prisma.video.create({
      data: {
        title: newData[i].title,
        description: newData[i].description,
        url: videoName,
        thumbnail: imageName,
        duration: duration,
        resolution: resolution,
        size: size,
        ownerId: newData[i].ownerId,
      },
    });
  }
  console.log('Insert video: ', newData.length);
};
