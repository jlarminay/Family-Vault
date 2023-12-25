import { defineStore } from 'pinia';

export const useVideoStore = defineStore('video', {
  state: () => ({}),

  getters: {},

  actions: {
    async getAll() {
      const env = useRuntimeConfig().public;
      const { $trpc } = useNuxtApp();

      let results = await $trpc.video.getAll.query();
      results = results.map((video: any) => {
        return {
          ...video,
          // clean video url
          url: video.url ? `${env.s3Endpoint}/${env.s3Bucket}/${video.url}` : '',
          // clean thumbnail url
          thumbnail: video.thumbnail
            ? `${env.s3Endpoint}/${env.s3Bucket}/${video.thumbnail}`
            : 'https://placehold.co/640x360',
        };
      });

      return results;
    },
    async getRandom(limit: number) {
      const env = useRuntimeConfig().public;
      const { $trpc } = useNuxtApp();

      let results = await $trpc.video.getRandom.query({ limit });
      results = results.map((video: any) => {
        return {
          ...video,
          // clean video url
          url: video.url ? `${env.s3Endpoint}/${env.s3Bucket}/${video.url}` : '',
          // clean thumbnail url
          thumbnail: video.thumbnail
            ? `${env.s3Endpoint}/${env.s3Bucket}/${video.thumbnail}`
            : 'https://placehold.co/640x360',
        };
      });

      return results;
    },
    async getSingle(id: number) {
      const env = useRuntimeConfig().public;
      const { $trpc } = useNuxtApp();

      let results = await $trpc.video.getSingle.query({ id });
      results = {
        ...results,
        // clean video url
        url: results.url ? `${env.s3Endpoint}/${env.s3Bucket}/${results.url}` : '',
        // clean thumbnail url
        thumbnail: results.thumbnail
          ? `${env.s3Endpoint}/${env.s3Bucket}/${results.thumbnail}`
          : 'https://placehold.co/640x360',
      };

      return results;
    },
  },
});
