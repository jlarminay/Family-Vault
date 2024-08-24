import shell from 'shelljs';
import fs from 'fs';
import { resolve } from 'path';
import sizeOf from 'image-size';

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

      // create thumbnail
      shell.exec(
        `ffmpeg -y -i "${videoPath}" -ss ${targetTime} -vframes 1 -vf scale=200:-1 "${targetDir}/${videoName}.thumbnail.jpg"`,
        { silent: true },
      );

      return {
        name: `${videoName}.thumbnail.jpg`,
        path: `${targetDir}/${videoName}.thumbnail.jpg`,
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
        const remotePath = path;
        const localPath = `${targetDir}/${name}`;

        shell.exec(`curl -o "${localPath}" "${remotePath}"`, { silent: true });
        newPath = resolve(localPath);
      }

      // get metadata
      const dimensions = sizeOf(newPath);
      const resolution = `${dimensions.width}x${dimensions.height}`;
      const size = fs.statSync(newPath).size;

      return {
        resolution,
        size,
      };
    },
    getThumbnail: async (opts: {
      name: string;
      path: string;
    }): Promise<{ name: string; path: string }> => {
      const { name, path } = opts;
      const targetDir = process.env.WORKING_TMP_FOLDER || './.tmp';
      let newPath = path;

      // check if file is local or remote
      if (path.startsWith('http')) {
        // download file
        const remotePath = path;
        const localPath = `${targetDir}/${name}`;

        shell.exec(`curl -o "${localPath}" "${remotePath}"`, { silent: true });
        newPath = resolve(localPath);
      }

      // create thumbnail
      shell.exec(
        `ffmpeg -i "${newPath}" -vf "scale=200:200:force_original_aspect_ratio=increase" "${targetDir}/${name}.thumbnail.jpg"`,
        {
          silent: true,
        },
      );

      // return path
      return {
        name: `${name}.thumbnail.jpg`,
        path: `${targetDir}/${name}.thumbnail.jpg`,
      };
    },
    getMajorColor: async (opts: { name: string; path: string }): Promise<string> => {
      const { name, path } = opts;
      const targetDir = process.env.WORKING_TMP_FOLDER || './.tmp';
      let newPath = path;

      // check if file is local or remote
      if (path.startsWith('http')) {
        // download file
        const remotePath = path;
        const localPath = `${targetDir}/${name}`;

        shell.exec(`curl -o "${localPath}" "${remotePath}"`, { silent: true });
        newPath = resolve(localPath);
      }

      return '#ff6666';
    },
  },
  pdf: {
    getMetadata: async (opts: {
      name: string;
      path: string;
    }): Promise<{
      size: number;
    }> => {
      const { name, path } = opts;
      const targetDir = process.env.WORKING_TMP_FOLDER || './.tmp';
      let newPath = path;

      // check if file is local or remote
      if (path.startsWith('http')) {
        // download file
        const remotePath = path;
        const localPath = `${targetDir}/${name}`;

        shell.exec(`curl -o "${localPath}" "${remotePath}"`, { silent: true });
        newPath = resolve(localPath);
      }

      // get metadata
      const size = fs.statSync(newPath).size;

      return {
        size,
      };
    },
    getThumbnail: async (opts: {
      name: string;
      path: string;
    }): Promise<{ name: string; path: string }> => {
      const { name, path } = opts;
      const targetDir = process.env.WORKING_TMP_FOLDER || './.tmp';
      let newPath = path;

      // check if file is local or remote
      if (path.startsWith('http')) {
        // download file
        const remotePath = path;
        const localPath = `${targetDir}/${name}`;

        shell.exec(`curl -o "${localPath}" "${remotePath}"`, { silent: true });
        newPath = resolve(localPath);
      }

      // create thumbnail
      shell.exec(
        `pdftoppm -jpeg -f 1 -l 1 -scale-to 400 "${targetDir}/${name}" "${targetDir}/${name}"`,
        {
          silent: true,
        },
      );

      // change name of new file from pdf to jpg
      fs.renameSync(`${targetDir}/${name}-01.jpg`, `${targetDir}/${name}.thumbnail.jpg`);

      // return path
      return {
        name: `${name}.thumbnail.jpg`,
        path: `${targetDir}/${name}.thumbnail.jpg`,
      };
    },
  },

  // general file operations
  delete: async (fileName: string): Promise<void> => {
    const targetDir = process.env.WORKING_TMP_FOLDER || './.tmp';
    const allFiles = fs.readdirSync(targetDir);

    // delete all files that contain the fileName
    allFiles.forEach((file) => {
      if (file.includes(fileName)) {
        fs.rmSync(resolve(`${targetDir}/${file}`));
      }
    });

    return;
  },
};
