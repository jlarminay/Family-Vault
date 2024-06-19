import { PrismaClient } from '@prisma/client';
import VideoProcessor from '../server/utils/videoProcessor.js';
import S3 from '../server/utils/s3.js';
import fs from 'fs';

const targetDir = process.env.WORKING_TMP_FOLDER || './.tmp';
const prisma = new PrismaClient();

async function waitForReset() {
  await new Promise((resolve) => setTimeout(resolve, 10000)); // wait 10 seconds
}

async function main() {
  while (true) {
    // check folder for new files
    const files = fs.readdirSync(targetDir).filter((file) => file.endsWith('.json'));

    if (files.length === 0) {
      await waitForReset();
      continue;
    }

    const file = files[0];
    const filePath = `${targetDir}/${file}`;
    const data: {
      videoId: number;
      key: string;
      name: string;
      targetVideo: string;
    } = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    console.log(`processing video ${data.key} ${data.name}`);

    // process new file
    let videoData: any = {};

    // get metadata
    try {
      const processing = new VideoProcessor(data.targetVideo);
      videoData = await processing.prepareNewVideo();
    } catch (e) {
      console.log(`failed to process video ${data.key} ${data.name}`);
      await waitForReset();
      continue;
    }

    // upload to s3
    try {
      const s3 = new S3();
      await s3.upload({
        key: `videos/${videoData.video.name}`,
        filePath: `${targetDir}/${videoData.video.name}`,
      });
      await s3.upload({
        key: `videos/${videoData.thumbnail.name}`,
        filePath: `${targetDir}/${videoData.thumbnail.name}`,
      });
    } catch (e) {
      console.log(`failed to upload to s3 ${data.key} ${data.name}`);
      await waitForReset();
      continue;
    }

    // insert into db
    try {
      const dbVideo = await prisma.file.create({ data: { ...videoData.video, name: data.name } });

      const dbThumbnail = await prisma.file.create({
        data: { ...videoData.thumbnail, name: data.name },
      });

      await prisma.video.update({
        where: { id: data.videoId },
        data: {
          videoId: dbVideo.id,
          thumbnailId: dbThumbnail.id,
          status: 'finished',
        },
      });
    } catch (e) {
      console.log(`failed to insert into db ${data.key} ${data.name}`);
      console.log(e);
      await waitForReset();
      continue;
    }

    // delete all old files
    try {
      fs.unlinkSync(`${targetDir}/${file}`);
      fs.unlinkSync(`${targetDir}/${videoData.video.name}`);
      fs.unlinkSync(`${targetDir}/${videoData.thumbnail.name}`);
    } catch (e) {
      console.log(`failed to delete old files ${data.key} ${data.name}`);
      await waitForReset();
      continue;
    }

    // wait 10 seconds
    await waitForReset();
  }
}

main();
