import shell from 'shelljs';
import fs from 'fs';
import { resolve } from 'path';
import sizeOf from 'image-size';
import { pdfToPng } from 'pdf-to-png-converter';

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
    delete: async (fileName: string): Promise<void> => {
      const targetDir = process.env.WORKING_TMP_FOLDER || './.tmp';
      const targetPath1 = resolve(`${targetDir}/${fileName}`);
      const targetPath2 = resolve(`${targetDir}/${fileName}`);

      // check if file exists
      if (fs.existsSync(targetPath1)) fs.rmSync(targetPath1);
      if (fs.existsSync(targetPath2)) fs.rmSync(targetPath2);

      return;
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

      // get thumbnail
      await pdfToPng(newPath, {
        outputFolder: targetDir,
        outputFileMask: `${name}.thumbnail.jpg`,
        pagesToProcess: [1],
      });

      // create thumbnail
      shell.exec(
        `ffmpeg -i "${targetDir}/${name}.thumbnail.jpg_page_1.png" -vf "scale=200:200:force_original_aspect_ratio=increase" "${targetDir}/${name}.thumbnail.jpg"`,
        {
          silent: true,
        },
      );

      // // change name of new file from pdf to jpg
      // fs.renameSync(
      //   `${targetDir}/${name}.thumbnail.jpg_page_1.png`,
      //   `${targetDir}/${name}.thumbnail.jpg`,
      // );

      // return path
      return {
        name: `${name}.thumbnail.jpg`,
        path: `${targetDir}/${name}.thumbnail.jpg`,
      };
    },
    delete: async (fileName: string): Promise<void> => {
      const targetDir = process.env.WORKING_TMP_FOLDER || './.tmp';
      const targetPath1 = resolve(`${targetDir}/${fileName}`);
      const targetPath2 = resolve(`${targetDir}/${fileName}.thumbnail.jpg`);
      const targetPath3 = resolve(`${targetDir}/${fileName}_page_1.png`);
      const targetPath4 = resolve(`${targetDir}/${fileName}.thumbnail.jpg_page_1.png`);

      // check if file exists
      if (fs.existsSync(targetPath1)) fs.rmSync(targetPath1);
      if (fs.existsSync(targetPath2)) fs.rmSync(targetPath2);
      if (fs.existsSync(targetPath3)) fs.rmSync(targetPath3);
      if (fs.existsSync(targetPath4)) fs.rmSync(targetPath4);

      return;
    },
  },
};
