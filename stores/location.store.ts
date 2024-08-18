import { defineStore } from 'pinia';

export const useLocationStore = defineStore('location', {
  state: () => ({}),

  getters: {},

  actions: {
    async getAll(opts: { named: boolean } | false = false): Promise<
      {
        id: number;
        name: string | null;
        latLong: string;
        city: string | null;
        country: string | null;
      }[]
    > {
      const { $trpc } = useNuxtApp();

      let results = await $trpc.location.getAll.query();

      if (opts && opts.named) {
        results = results.filter((location) => location.name !== null);
      }

      return results;
    },
  },
});
