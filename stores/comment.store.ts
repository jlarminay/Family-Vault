import { defineStore } from 'pinia';

export const useCommentStore = defineStore('comment', {
  state: () => ({}),

  getters: {},

  actions: {
    async getForVideo(videoId: number) {
      const { $trpc } = useNuxtApp();
      const results = await $trpc.comment.getForVideo.query({ videoId });
      return results;
    },
    async create(videoId: number, userId: number, text: string) {
      const { $trpc } = useNuxtApp();
      const results = await $trpc.comment.create.mutate({ videoId, userId, text });
      return results;
    },
  },
});
