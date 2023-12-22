import { defineStore } from 'pinia';

export const useTestStore = defineStore('test', {
  state: () => ({
    count: 0 as number,
  }),

  getters: {
    getCount(): number {
      return this.count;
    },
  },

  actions: {
    increment(add: number) {
      this.count += add;
    },
    decrement(sub: number) {
      this.count -= sub;
    },
    async getHello() {
      const { $trpc } = useNuxtApp();
      const results = await $trpc.test.hello.useQuery({ text: 'everyone again!!' });
      return results.data;
    },
  },
});
