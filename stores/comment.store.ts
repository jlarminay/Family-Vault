import { defineStore } from 'pinia';

export const useCommentStore = defineStore('comment', {
  state: () => ({}),

  getters: {},

  actions: {
    async getForVideo(itemId: number) {
      const { $trpc } = useNuxtApp();
      return await $trpc.comment.getForVideo.query({ itemId });
    },
    async createForVideo(itemId: number, text: string) {
      const { $trpc } = useNuxtApp();
      return await $trpc.comment.createForVideo.mutate({ itemId, text });
    },
  },
});
