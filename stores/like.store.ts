import { defineStore } from 'pinia';

export const useLikeStore = defineStore('like', {
  state: () => ({}),

  getters: {},

  actions: {
    async getForVideo(itemId: number) {
      const { $trpc } = useNuxtApp();

      let results = await $trpc.like.getForVideo.query({ itemId });
      return results;
    },
    async getAllMine() {
      const { $trpc } = useNuxtApp();

      let results = await $trpc.like.getAllMine.query();
      return results;
    },
    async update(itemId: number, liked: boolean) {
      const { $trpc } = useNuxtApp();

      let results = await $trpc.like.update.mutate({
        itemId,
        liked,
      });
      return results;
    },
  },
});
