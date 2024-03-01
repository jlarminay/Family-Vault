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

    async createOrUpdate(collection: any) {
      if (collection.id) {
        return await this.update(collection);
      } else {
        return await this.create(collection);
      }
    },
    async create(collection: any) {
      const { $trpc } = useNuxtApp();
      let results = await $trpc.collection.create.mutate(collection);
      return results;
    },
    async update(collection: any) {
      const { $trpc } = useNuxtApp();
      let results = await $trpc.collection.update.mutate(collection);
      return results;
    },

    async delete(id: number) {
      const { $trpc } = useNuxtApp();
      let results = await $trpc.collection.delete.mutate({ id });
      return results;
    },
  },
});
