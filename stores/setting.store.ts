import { defineStore } from 'pinia';

export const useSettingStore = defineStore('setting', {
  state: () => ({}),

  getters: {},

  actions: {
    async getAll() {
      const { $trpc } = useNuxtApp();
      return await $trpc.setting.getAll.query();
    },
  },
});
