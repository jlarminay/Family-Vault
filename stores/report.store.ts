import { defineStore } from 'pinia';

export const useReportStore = defineStore('report', {
  state: () => ({}),

  getters: {},

  actions: {
    async create(videoId: number, report: string) {
      const { $trpc } = useNuxtApp();

      let results = await $trpc.report.create.mutate({
        videoId,
        report,
      });
      return results;
    },
  },
});
