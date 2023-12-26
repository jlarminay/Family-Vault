import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({}),

  getters: {},

  actions: {
    async getAll() {
      const { $trpc } = useNuxtApp();
      let results = await $trpc.person.getAll.query();
      return results;
    },
    async getSingle(id: number) {
      const { $trpc } = useNuxtApp();
      let results = await $trpc.person.getSingle.query({ id });
      return results;
    },
  },
});
