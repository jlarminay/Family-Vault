import { defineStore } from 'pinia';

export const useVideoStore = defineStore('video', {
  state: () => ({
    uploadState: {
      state: 'idle',
      progress: 0,
    },
  }),

  getters: {},

  actions: {
    async getAllPublic() {
      const { $trpc } = useNuxtApp();

      let results = await $trpc.video.getAllPublic.query();
      results = results.map((video: any) => {
        return {
          ...video,
          // clean thumbnail url
          thumbnail: video.thumbnail || { path: 'https://placehold.co/640x360' },
        };
      });

      return results;
    },
    async getAllLiked() {
      const { $trpc } = useNuxtApp();

      let results = await $trpc.video.getAllLiked.query();
      results = results.map((video: any) => {
        return {
          ...video,
          // clean thumbnail url
          thumbnail: video.thumbnail || { path: 'https://placehold.co/640x360' },
        };
      });

      return results;
    },
    async getAllMine() {
      const { $trpc } = useNuxtApp();

      let results = await $trpc.video.getAllMine.query();
      results = results.map((video: any) => {
        return {
          ...video,
          // clean thumbnail url
          thumbnail: video.thumbnail || { path: 'https://placehold.co/640x360' },
        };
      });

      return results;
    },

    async getRandom(limit: number, ignore: number | undefined = undefined) {
      const { $trpc } = useNuxtApp();

      let results = await $trpc.video.getRandom.query({ limit });
      results = results
        .filter((video: any) => {
          return video.id !== ignore;
        })
        .map((video: any) => {
          return {
            ...video,
            // clean thumbnail url
            thumbnail: video.thumbnail || 'https://placehold.co/640x360',
          };
        });

      return results;
    },

    async getSingle(id: number) {
      const { $trpc } = useNuxtApp();

      let results = await $trpc.video.getSingle.query({ id });
      return {
        ...results,
        // clean thumbnail url
        thumbnail: results.thumbnail || { path: 'https://placehold.co/640x360' },
      };
    },

    async uploadVideo(videoData: string) {
      const { $trpc } = useNuxtApp();

      this.uploadState.state = 'uploading';

      // get packets
      const allPackets = [];
      const packetSize = 100000;
      let i = 0;
      while (i < videoData.length) {
        allPackets.push(videoData.slice(i, i + packetSize));
        i += packetSize;
      }
      console.log('packets: ', allPackets.length);

      // send to api
      const randomString =
        Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12);
      console.log('key: ', randomString, randomString.length);

      // upload all packets
      for (let j = 0; j < allPackets.length; j++) {
        console.log('-Uploading packet ', j + 1);
        const response = await $trpc.video.uploadVideo.mutate({
          key: randomString,
          name: 'video.mp4',
          current: j + 1,
          total: allPackets.length,
          packet: allPackets[j],
        });

        // update progress
        this.uploadState.progress = Math.floor(((j + 1) / allPackets.length) * 100);

        await new Promise((resolve) => setTimeout(resolve, 100));
        if (typeof response !== 'boolean') {
          this.uploadState.state = 'complete';
          return response;
        }
      }
    },
  },
});
