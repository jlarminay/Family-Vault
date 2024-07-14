import shell from 'shelljs';

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
      const { stdout } = shell.exec(
        `ffprobe -v quiet -print_format json -show_format -show_streams "${videoPath}"`,
        { silent: true },
      );

      const probeData = JSON.parse(stdout);
      const videoStream = probeData.streams.find((stream: any) => stream.codec_type === 'video');

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
      videoPath: string;
      duration: number;
      timePercentage: number;
    }): Promise<{ name: string; path: string }> => {
      const { videoPath, duration, timePercentage } = opts;
      const targetDir = process.env.WORKING_TMP_FOLDER || './.tmp';
      const fileName = videoPath.split('/').pop() || '';

      // get time at percentage of video duration
      const targetTime = Math.floor((duration * timePercentage) / 100);

      const { stdout, stderr, code } = shell.exec(
        `ffmpeg -y -i "${videoPath}" -ss ${targetTime} -vframes 1 "${targetDir}/${fileName}.thumbnail.webp"`,
        { silent: true },
      );

      if (code !== 0) {
        throw new Error(stderr);
      }

      return {
        name: `${fileName}.thumbnail.webp`,
        path: `${targetDir}/${fileName}.thumbnail.webp`,
      };
    },
  },
  image: {
    getMetadata: async (opts: {
      name: string;
      path: string;
    }): Promise<{
      resolution: string;
    }> => {
      const { name, path } = opts;

      const resolution = '0x0';

      return {
        resolution,
      };
    },
  },
};
