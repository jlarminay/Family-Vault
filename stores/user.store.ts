import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({}),

  getters: {},

  actions: {
    async getAll() {
      const { $trpc } = useNuxtApp();
      let results = await $trpc.user.getAll.query();
      return results;
    },
    async getSingle(id: number) {
      const { $trpc } = useNuxtApp();
      let results = await $trpc.user.getSingle.query({ id });
      return results;
    },

    async createOrUpdate(user: any) {
      if (user.id) {
        return await this.update(user);
      } else {
        return await this.create(user);
      }
    },
    async create(user: any) {
      const { $trpc } = useNuxtApp();
      let results = await $trpc.user.create.mutate(user);
      return results;
    },
    async update(user: any) {
      const { $trpc } = useNuxtApp();
      let results = await $trpc.user.update.mutate(user);
      return results;
    },

    async delete(id: number) {
      const { $trpc } = useNuxtApp();
      let results = await $trpc.user.delete.mutate({ id });
      return results;
    },
  },
});
