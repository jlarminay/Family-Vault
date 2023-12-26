import { defineStore } from 'pinia';

export const useLikeStore = defineStore('like', {
  state: () => ({}),

  getters: {},

  actions: {
    async getVideoCount(videoId: number) {
      const { $trpc } = useNuxtApp();

      let results = await $trpc.like.getVideoCount.query({ videoId });
      return results;
    },
    async isVideoLiked(videoId: number) {
      const { $trpc } = useNuxtApp();
      const { data } = useAuth();

      let results = await $trpc.like.isVideoLiked.query({
        videoId: videoId,
        userId: data.value?.id || 0,
      });
      return results;
    },
    async update(videoId: number, like: boolean) {
      const { $trpc } = useNuxtApp();
      const { data } = useAuth();

      let results = await $trpc.like.update.mutate({
        videoId: videoId,
        userId: data.value?.id || 0,
        like,
      });
      return results;
    },
  },
});
