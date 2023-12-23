import { defineStore } from 'pinia';

export const useVideoStore = defineStore('video', {
  state: () => ({}),

  getters: {},

  actions: {
    async getAll() {
      const { $trpc } = useNuxtApp();
      const results = await $trpc.video.getAll.query();
      return results;
    },
    async getSingle(id: number) {
      const { $trpc } = useNuxtApp();
      const results = await $trpc.video.getSingle.query({ id });
      return results;
    },
  },
});
