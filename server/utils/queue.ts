import Queue from 'better-queue';
import shell from 'shelljs';

const queue = new Queue(
  async (
    input: {
      videoId: number;
      key: string;
      name: string;
      targetVideo: string;
    },
    cb: any,
  ) => {
    const { videoId, key, name, targetVideo } = input;

    shell.exec(
      `node --loader ts-node/esm functions/processVideo.js ${videoId} ${key} "${name}" ${targetVideo}`,
      {
        silent: true,
      },
    );

    // wait 60s before staring the next task
    await new Promise((resolve) => setTimeout(resolve, 60000));

    return cb();
  },
  {
    concurrent: 1,
    afterProcessDelay: 1000,
    maxRetries: 3,
    retryDelay: 1000,
  },
);

export default queue;
