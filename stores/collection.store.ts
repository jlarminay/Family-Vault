import { defineStore } from 'pinia';

export const useCollectionStore = defineStore('collection', {
  state: () => ({}),

  getters: {},

  actions: {
    async getAll() {
      const { $trpc } = useNuxtApp();
      let results = await $trpc.collection.getAll.query();
      return results;
    },
    async getSingle(id: number) {
      const { $trpc } = useNuxtApp();
      let results = await $trpc.collection.getSingle.query({ id });
      return results;
    },
  },
});
