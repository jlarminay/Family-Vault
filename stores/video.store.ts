import { defineStore } from 'pinia';

export const useVideoStore = defineStore('video', {
  state: () => ({
    showUploadModal: false,
    uploadState: 'idle',
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

    async getRandom(limit: number, ignore: number | undefined = undefined) {
      const { $trpc } = useNuxtApp();

      let results = await $trpc.video.getRandom.query({ limit });
      results = results
        .filter((video: any) => {
          return video.id !== ignore;
        })
        .map((video: any) => {
          return {
            ...video,
            // clean thumbnail url
            thumbnail: video.thumbnail || 'https://placehold.co/640x360?text=Processing...',
          };
        });

      return results;
    },

    async getSingle(id: number) {
      const { $trpc } = useNuxtApp();

      let results = await $trpc.video.getSingle.query({ id });
      return {
        ...results,
      };
    },
    async update(videoData: any) {
      const { $trpc } = useNuxtApp();

      const newVideoData = {
        id: videoData.id,
        title: videoData.title,
        description: videoData.description,
        dateDisplay: videoData.dateDisplay,
        dateOrder: videoData.dateOrder,
        persons: videoData.persons.map((person: any) => person.value),
        collections: videoData.collections.map((collection: any) => collection.value),
        published: videoData.published,
        allowList: videoData.allowList ? videoData.allowList.map((user: any) => user.value) : [],
      };

      return await $trpc.video.update.mutate(newVideoData);
    },
  },
});
