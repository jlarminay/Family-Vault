import { defineStore } from 'pinia';

export const useVideoStore = defineStore('video', {
  state: () => ({}),

  getters: {},

  actions: {
    async getAll() {
      const { $trpc } = useNuxtApp();
      const results = await $trpc.video.getAll.useQuery();
      return results.data;
    },
  },
});
