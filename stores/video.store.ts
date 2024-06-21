import { defineStore } from 'pinia';

export const useVideoStore = defineStore('video', {
  state: () => ({
    showUploadModal: false,
  }),

  getters: {},

  actions: {
    async search(options: any) {
      const { $trpc } = useNuxtApp();

      let results = await $trpc.video.search.query(options);
      return results.map((video: any) => {
        return {
          ...video,
          // clean thumbnail url
          thumbnail: video.thumbnail || { path: 'https://placehold.co/640x360?text=Processing...' },
        };
      });
    },

    async getRelated(currentId: number, limit: number) {
      const { $trpc } = useNuxtApp();

      let results = await $trpc.video.getRelated.query({ currentId, limit });
      return results;
    },

    async getSingle(id: number) {
      const { $trpc } = useNuxtApp();

      let results = await $trpc.video.getSingle.query({ id });
      return {
        ...results,
      };
    },

    async incrementViewCount(id: number) {
      const { $trpc } = useNuxtApp();
      return await $trpc.video.incrementViewCount.mutate({ id });
    },

    async update(videoData: any) {
      const { $trpc } = useNuxtApp();

      const newVideoData = {
        id: videoData.id,
        title: videoData.title,
        description: videoData.description,
        people: videoData.people,
        tags: videoData.tags,
        dateDisplay: videoData.dateDisplay,
        dateOrder: videoData.dateOrder,
        published: videoData.published,
        allowList: videoData.allowList ? videoData.allowList.map((user: any) => user.value) : [],
      };

      return await $trpc.video.update.mutate(newVideoData);
    },
  },
});
