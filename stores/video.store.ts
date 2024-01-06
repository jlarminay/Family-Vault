import { defineStore } from 'pinia';

export const useVideoStore = defineStore('video', {
  state: () => ({}),

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
  },
});
