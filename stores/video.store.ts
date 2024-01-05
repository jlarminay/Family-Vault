import { defineStore } from 'pinia';

export const useVideoStore = defineStore('video', {
  state: () => ({}),

  getters: {},

  actions: {
    async getAll() {
      const { $trpc } = useNuxtApp();

      let results = await $trpc.video.getAll.query();
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
    async getLiked() {
      const { $trpc } = useNuxtApp();
      const { data } = useAuth();

      let results = await $trpc.video.getLiked.query({ userId: data.value?.id || 0 });
      results = results.map((video: any) => {
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
