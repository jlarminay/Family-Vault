import shell from 'shelljs';
import { statSync } from 'fs';
import { resolve } from 'path';
import sizeOf from 'image-size';
import fs from 'fs';

export default {
  video: {
    getMetadata: async (opts: {
      videoPath: string;
    }): Promise<{
      rotation: number | null;
      resolution: string;
      duration: number;
    }> => {
      const { videoPath } = opts;
      // check if file exists
      const { stdout } = shell.exec(
        `ffprobe -v quiet -print_format json -show_format -show_streams "${videoPath}"`,
        { silent: true },
      );

      const probeData = JSON.parse(stdout);
      const videoStream = probeData.streams?.find((stream: any) => stream.codec_type === 'video');

      const rotation =
        videoStream.side_data_list?.find((sideData: any) => sideData.rotation)?.rotation || null;
      const resolution = rotation
        ? `${videoStream.height}x${videoStream.width}`
        : `${videoStream.width}x${videoStream.height}`;
      const duration = probeData.format.duration;

      return {
        rotation,
        resolution,
        duration,
      };
    },
    getThumbnailAt: async (opts: {
      videoName: string;
      videoPath: string;
      duration: number;
      timePercentage: number;
    }): Promise<{ name: string; path: string }> => {
      const { videoName, videoPath, duration, timePercentage } = opts;
      const targetDir = process.env.WORKING_TMP_FOLDER || './.tmp';

      // get time at percentage of video duration
      const targetTime = Math.floor((duration * timePercentage) / 100);

      const targetVideoPath = videoPath.replace(' ', '%20');

      const { stdout, stderr, code } = shell.exec(
        `ffmpeg -y -i "${targetVideoPath}" -ss ${targetTime} -vframes 1 "${targetDir}/${videoName}.thumbnail.webp"`,
        { silent: true },
      );

      if (code !== 0) {
        throw new Error(stderr);
      }

      return {
        name: `${videoName}.thumbnail.webp`,
        path: `${targetDir}/${videoName}.thumbnail.webp`,
      };
    },
  },
  image: {
    getMetadata: async (opts: {
      name: string;
      path: string;
    }): Promise<{
      resolution: string;
      size: number;
    }> => {
      const { name, path } = opts;
      const targetDir = process.env.WORKING_TMP_FOLDER || './.tmp';
      let newPath = path;

      // check if file is local or remote
      if (path.startsWith('http')) {
        // download file
        const remotePath = path.replace(' ', '%20');
        const localPath = `${targetDir}/${name}`.replace(' ', '%20');

        shell.exec(`curl -o ${localPath} ${remotePath}`, { silent: true });
        newPath = resolve(localPath);
      }

      // get metadata
      const dimensions = sizeOf(newPath);
      const resolution = `${dimensions.width}x${dimensions.height}`;
      const size = statSync(newPath).size;

      return {
        resolution,
        size,
      };
    },
    delete: async (fileName: string): Promise<void> => {
      const targetDir = process.env.WORKING_TMP_FOLDER || './.tmp';
      const targetPath = resolve(`${targetDir}/${fileName}`.replace(' ', '%20'));

      // check if file exists
      if (!fs.existsSync(targetPath)) return;

      // delete file
      fs.rmSync(targetPath);
    },
  },
};
