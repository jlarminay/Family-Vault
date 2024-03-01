import { defineStore } from 'pinia';

export const useReportStore = defineStore('report', {
  state: () => ({}),

  getters: {},

  actions: {
    async getAll() {
      const { $trpc } = useNuxtApp();

      let results = await $trpc.report.getAll.query();
      return results;
    },
    async create(videoId: number, report: string) {
      const { $trpc } = useNuxtApp();

      let results = await $trpc.report.create.mutate({
        videoId,
        report,
      });
      return results;
    },
    async delete(id: number) {
      const { $trpc } = useNuxtApp();

      let results = await $trpc.report.delete.mutate({ id });
      return results;
    },
  },
});
