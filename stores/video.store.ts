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
          thumbnail: video.thumbnail || 'https://placehold.co/640x360',
        };
      });
      return results;
    },
    async getRandom(limit: number) {
      const { $trpc } = useNuxtApp();
      let results = await $trpc.video.getRandom.query({ limit });
      results = results.map((video: any) => {
        return {
          ...video,
          thumbnail: video.thumbnail || 'https://placehold.co/640x360',
        };
      });
      return results;
    },
    async getSingle(id: number) {
      const { $trpc } = useNuxtApp();
      let results = await $trpc.video.getSingle.query({ id });
      results = {
        ...results,
        thumbnail: results.thumbnail || 'https://placehold.co/640x360',
      };
      return results;
    },
  },
});
