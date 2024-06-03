import { statSync } from 'fs';
import { resolve } from 'path';
import sizeOf from 'image-size';
import shell from 'shelljs';

export default class VideoProcessor {
  private videoPath: string;

  constructor(video: string) {
    this.videoPath = video;
  }

  async getThumbnailAt(opts: { time: string; filename: string }): Promise<boolean> {
    const { time, filename } = opts;
    const targetDir = process.env.WORKING_TMP_FOLDER || './.tmp';

    const { stdout, stderr, code } = shell.exec(
      `ffmpeg -i "${this.videoPath}" -ss ${time} -vframes 1 "${targetDir}/${filename}"`,
      { silent: true },
    );

    if (code !== 0) {
      throw new Error(stderr);
    }

    return true;
  }

  async getMetadata(): Promise<{
    duration: number;
    width: number;
    height: number;
    resolution: string;
    size: number;
  }> {
    const { stdout, stderr, code } = shell.exec(
      `ffprobe -v error -show_entries format=duration:stream=width:stream=height -of default=noprint_wrappers=1:nokey=1 -show_format -show_entries format=size ${this.videoPath}`,
      { silent: true },
    );

    if (code !== 0) {
      throw new Error(stderr);
    }

    // parse output
    const output = stdout.trim().split('\n');

    // extract data
    const width = parseInt(output[0]);
    const height = parseInt(output[1]);
    const resolution = `${width}x${height}`;
    const duration = Math.floor(parseFloat(output[2]));
    const size = parseInt(output[3]);

    return { duration, width, height, resolution, size };
  }

  async prepareNewVideo(): Promise<any> {
    const targetDir = process.env.WORKING_TMP_FOLDER || './.tmp';
    let finalData = {
      randomString: Math.random().toString(16).slice(2),
      video: {} as any,
      thumbnail: {} as any,
    };

    // // // manage video
    {
      finalData.video.name = this.videoPath.split('/').pop();
      console.log('starting metadata', finalData.video.name);
      // get metadata
      const { duration, resolution, size } = await this.getMetadata();
      console.log('metadata', duration, resolution, size);
      finalData.video = {
        name: finalData.video.name,
        type: 'video',
        path: `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${process.env.ENVIRONMENT}/videos/${finalData.randomString}_${finalData.video.name}`,
        size: size,
        metadata: {
          resolution: resolution,
          duration: duration,
        },
      };
    }

    // // // manage thumbnail
    {
      finalData.thumbnail.name = finalData.video.name.replace('.mp4', '.webp');

      // generate
      console.log('starting thumbnail', finalData.thumbnail.name);
      await this.getThumbnailAt({
        time: this.getTimestampPercent(finalData.video.metadata.duration, 0.1),
        filename: finalData.thumbnail.name,
      });
      console.log('thumbnail generated', finalData.thumbnail.name);

      // get metadata
      const dimensions = sizeOf(resolve(`${targetDir}/${finalData.thumbnail.name}`));
      console.log('thumbnail dimensions', dimensions);
      finalData.thumbnail = {
        name: finalData.thumbnail.name,
        type: 'image',
        path: `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${process.env.ENVIRONMENT}/videos/${finalData.randomString}_${finalData.thumbnail.name}`,
        size: statSync(resolve(`${targetDir}/${finalData.thumbnail.name}`)).size,
        metadata: {
          resolution: `${dimensions.width}x${dimensions.height}`,
        },
      };
    }

    return finalData;
  }

  private getTimestampPercent(duration: number, percentage: number): string {
    const lengthPercent = Math.floor(duration * percentage);
    const hours = Math.floor(lengthPercent / 3600);
    const minutes = Math.floor((lengthPercent % 3600) / 60);
    const seconds = lengthPercent % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }
}
