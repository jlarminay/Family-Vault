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
    date: string;
  }> {
    const { stdout, stderr, code } = shell.exec(
      // `ffprobe -v error -show_entries format=duration:stream=width:stream=height -of default=noprint_wrappers=1:nokey=1 -show_format -show_entries format=size ${this.videoPath}`,
      `ffprobe -v error -show_format -show_streams -print_format json  ${this.videoPath}`,
      { silent: true },
    );

    if (code !== 0) {
      throw new Error(stderr);
    }

    // parse output
    const output = JSON.parse(stdout);

    // extract data
    let width = parseInt(output.streams[0].width);
    let height = parseInt(output.streams[0].height);
    const duration = Math.floor(parseFloat(output.format.duration));
    const size = parseInt(output.format.size);
    const date = output.format.tags.creation_time;
    const rotate = output.streams[0]?.side_data_list?.[0]?.rotation || null;

    if (rotate) {
      width = parseInt(output.streams[0].height);
      height = parseInt(output.streams[0].width);
    }

    const resolution = `${width}x${height}`;

    return { duration, width, height, resolution, size, date };
  }

  async prepareNewVideo(): Promise<any> {
    const targetDir = process.env.WORKING_TMP_FOLDER || './.tmp';
    let finalData = {
      video: {} as any,
      thumbnail: {} as any,
    };

    // // // manage video
    {
      finalData.video.name = this.videoPath.split('/').pop();
      // get metadata
      const { duration, resolution, size, date } = await this.getMetadata();
      finalData.video = {
        name: finalData.video.name,
        type: 'video',
        path: `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${process.env.ENVIRONMENT}/videos/${finalData.video.name}`,
        size: size,
        metadata: {
          resolution: resolution,
          duration: duration,
        },
        // date: date,
      };
    }

    // // // manage thumbnail
    {
      finalData.thumbnail.name = finalData.video.name.replace('.mp4', '.webp');

      // generate
      await this.getThumbnailAt({
        time: this.getTimestampPercent(finalData.video.metadata.duration, 0.1),
        filename: finalData.thumbnail.name,
      });

      // get metadata
      const dimensions = sizeOf(resolve(`${targetDir}/${finalData.thumbnail.name}`));
      finalData.thumbnail = {
        name: finalData.thumbnail.name,
        type: 'image',
        path: `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${process.env.ENVIRONMENT}/videos/${finalData.thumbnail.name}`,
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
