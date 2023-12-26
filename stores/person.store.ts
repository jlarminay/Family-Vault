import { defineStore } from 'pinia';

export const usePersonStore = defineStore('person', {
  state: () => ({}),

  getters: {},

  actions: {
    async getAll() {
      const { $trpc } = useNuxtApp();
      let results = await $trpc.person.getAll.query();
      results = results.map((person: any) => {
        return {
          ...person,
          image: person.image || 'https://placehold.co/600x600',
        };
      });
      return results;
    },
    async getSingle(id: number) {
      const { $trpc } = useNuxtApp();
      let results = await $trpc.person.getSingle.query({ id });
      results = {
        ...results,
        image: results.image || 'https://placehold.co/600x600',
      };
      return results;
    },
  },
});
