import { defineStore } from 'pinia';

export const useCommentStore = defineStore('comment', {
  state: () => ({}),

  getters: {},

  actions: {
    async getForVideo(videoId: number) {
      const { $trpc } = useNuxtApp();
      return await $trpc.comment.getForVideo.query({ videoId });
    },
    async createForVideo(videoId: number, text: string) {
      const { $trpc } = useNuxtApp();
      return await $trpc.comment.createForVideo.mutate({ videoId, text });
    },
  },
});
