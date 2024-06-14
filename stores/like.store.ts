import { defineStore } from 'pinia';

export const useLikeStore = defineStore('like', {
  state: () => ({}),

  getters: {},

  actions: {
    async getForVideo(videoId: number) {
      const { $trpc } = useNuxtApp();

      let results = await $trpc.like.getForVideo.query({ videoId });
      return results;
    },
    async getAllMine() {
      const { $trpc } = useNuxtApp();

      let results = await $trpc.like.getAllMine.query();
      return results;
    },
    async update(videoId: number, liked: boolean) {
      const { $trpc } = useNuxtApp();

      let results = await $trpc.like.update.mutate({
        videoId: videoId,
        liked,
      });
      return results;
    },
  },
});
