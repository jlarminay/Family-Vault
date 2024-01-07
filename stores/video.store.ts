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

    async uploadVideo(video: any) {
      const { $trpc } = useNuxtApp();

      this.uploadState.state = 'uploading';

      const key =
        Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12);
      const chunkSize = 1 * 1024 * 1024;
      let start = 0;
      let i = 1;
      let response: any;

      while (start < video.data.size) {
        const chunk = video.data.slice(start, start + chunkSize);
        const arrayBuffer = await new Response(chunk).arrayBuffer();
        const base64String = btoa(
          new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''),
        );
        response = await $trpc.video.uploadVideo.mutate({
          key,
          name: 'video.mp4',
          count: i,
          final: start + chunkSize >= video.data.size,
          packet: base64String,
        });
        start += chunkSize;
        i++;

        this.uploadState.progress = Math.min((start / video.data.size) * 100, 100);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      this.uploadState.state = 'complete';
      return response;

      // // get packets
      // const allPackets = [];
      // const packetSize = 1 * 1024 * 1024;
      // let i = 0;
      // while (i < videoData.length) {
      //   allPackets.push(videoData.slice(i, i + packetSize));
      //   i += packetSize;
      // }

      // // send to api
      // const randomString =
      //   Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12);

      // // upload all packets
      // for (let j = 0; j < allPackets.length; j++) {
      //   const response = await $trpc.video.uploadVideo.mutate({
      //     key: randomString,
      //     name: 'video.mp4',
      //     current: j + 1,
      //     total: allPackets.length,
      //     packet: allPackets[j],
      //   });

      //   // update progress
      //   this.uploadState.progress = Math.floor(((j + 1) / allPackets.length) * 100);

      //   await new Promise((resolve) => setTimeout(resolve, 100));
      //   if (typeof response !== 'boolean') {
      //     this.uploadState.state = 'complete';
      //     return response;
      //   }
      // }
    },
  },
});
