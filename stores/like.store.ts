import { defineStore } from 'pinia';

export const useLikeStore = defineStore('like', {
  state: () => ({}),

  getters: {},

  actions: {
    async getForVideo(itemId: number): Promise<{
      count: number;
      isLiked: boolean;
    }> {
      const { $trpc } = useNuxtApp();

      let results = await $trpc.like.getForVideo.query({ itemId });
      return results;
    },
    async getAllMine(): Promise<
      {
        id: number;
        item: {
          id: number;
          path: string;
          type: string;
          name: string;
        };
        createdAt: string;
        userId: number;
        itemId: number;
      }[]
    > {
      const { $trpc } = useNuxtApp();

      let results = await $trpc.like.getAllMine.query();
      return results;
    },
    async update(itemId: number, liked: boolean): Promise<boolean> {
      const { $trpc } = useNuxtApp();

      let results = await $trpc.like.update.mutate({
        itemId,
        liked,
      });
      return results;
    },
  },
});
