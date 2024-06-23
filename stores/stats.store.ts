import { defineStore } from 'pinia';

export const useStatsStore = defineStore('stats', {
  state: () => ({}),

  getters: {},

  actions: {
    async getAll() {
      const { $trpc } = useNuxtApp();
      return await $trpc.stats.getAll.query();
    },
  },
});
