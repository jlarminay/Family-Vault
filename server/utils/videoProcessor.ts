import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

export default class VideoProcessor {
  private videoPath: string;

  constructor(video: string) {
    this.videoPath = video;
  }

  convertToMp4(): boolean {
    return true;
  }

  getThumbnailAt(opts: { time: string; filename: string }): Promise<void> {
    const { time, filename } = opts;

    return new Promise((resolve, reject) => {
      ffmpeg(this.videoPath)
        .screenshot({
          timestamps: [time],
          filename: filename,
          folder: './.tmp',
        })
        .on('end', () => {
          resolve();
        })
        .on('error', (err) => {
          reject(err);
        });
    });
  }

  async getMetadata(): Promise<{
    duration: number;
    width: number;
    height: number;
    resolution: string;
    size: number;
  }> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(this.videoPath, (err, metadata) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            duration: parseInt(metadata.streams[0]?.duration || '0'),
            width: metadata.streams[0]?.width || 0,
            height: metadata.streams[0]?.height || 0,
            resolution: `${metadata.streams[0]?.width}x${metadata.streams[0]?.height}`,
            size: metadata.format.size || 0,
          });
        }
      });
    });
  }
}
