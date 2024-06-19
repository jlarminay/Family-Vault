import { PrismaClient } from '@prisma/client';
import VideoProcessor from '../server/utils/videoProcessor.js';
import S3 from '../server/utils/s3.js';
import fs from 'fs';

const args = process.argv;
const videoId = parseInt(args[2]) as number;
const key = args[3];
const name = args[4];
const targetVideo = args[5];

if (!videoId || !key || !name || !targetVideo) {
  console.error('missing arguments');
  process.exit(1);
}

const prisma = new PrismaClient();
const targetDir = process.env.WORKING_TMP_FOLDER || './.tmp';
const logFile = `${targetDir}/${key}_process.log`;

// create file and folder if not exists
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir);
if (!fs.existsSync(logFile)) fs.writeFileSync(logFile, '');
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

function log(message: string) {
  logStream.write(`${new Date().toISOString()} - ${message}\n`);
}
async function main() {
  let videoData: any = {};

  log(`processing video ${key} ${name}`);

  // get metadata
  try {
    const processing = new VideoProcessor(targetVideo);
    videoData = await processing.prepareNewVideo();
  } catch (_e) {
    log(`failed to process video ${key} ${targetVideo}`);
    log(JSON.stringify(_e));
    return;
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
  } catch (_e) {
    log(`failed to upload to s3 ${key} ${name}`);
    return;
  }

  // insert into db
  try {
    const dbVideo = await prisma.file.create({ data: { ...videoData.video, name } });
    log(JSON.stringify(dbVideo));

    const dbThumbnail = await prisma.file.create({
      data: { ...videoData.thumbnail, name },
    });
    log(JSON.stringify(dbThumbnail));

    const updateVideo = await prisma.video.update({
      where: { id: videoId },
      data: {
        videoId: dbVideo.id,
        thumbnailId: dbThumbnail.id,
        status: 'finished',
      },
    });
    log(JSON.stringify(updateVideo));
  } catch (_e) {
    log(`failed to insert into db ${key} ${name}`);
    return;
  }

  // delete all old files
  try {
    fs.unlinkSync(`${targetDir}/${videoData.video.name}`);
    fs.unlinkSync(`${targetDir}/${videoData.thumbnail.name}`);
  } catch (_e) {
    log(`failed to delete files ${key} ${name}`);
    return;
  }
}

await main();
logStream.end();
