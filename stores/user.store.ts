import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({}),

  getters: {},

  actions: {
    async getAll() {
      const { $trpc } = useNuxtApp();
      const results = await $trpc.user.getAll.query();
      return results.map((result) => {
        return {
          label: result.name,
          value: result.id,
        };
      });
    },

    async updateOwn(id: number, name: string) {
      const { $trpc } = useNuxtApp();
      return await $trpc.user.updateOwn.mutate({ id, name });
    },
  },
});
