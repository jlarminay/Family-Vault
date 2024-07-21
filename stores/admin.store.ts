import { defineStore } from 'pinia';

export const useAdminStore = defineStore('admin', {
  state: () => ({}),

  getters: {},

  actions: {
    // item (R)
    ...{
      async itemRead() {
        const { $trpc } = useNuxtApp();
        return await $trpc.admin.itemRead.query();
      },
    },

    // user (CRU)
    ...{
      async userCreate(user: any) {
        const { $trpc } = useNuxtApp();
        return await $trpc.admin.userCreate.mutate(user);
      },
      async userRead() {
        const { $trpc } = useNuxtApp();
        return await $trpc.admin.userRead.query();
      },
      async userUpdate(user: any) {
        const { $trpc } = useNuxtApp();
        return await $trpc.admin.userUpdate.mutate(user);
      },
    },

    // force recheck s3 bucket
    ...{
      async forceRecheckS3Bucket() {
        const { $trpc } = useNuxtApp();
        return await $trpc.admin.forceRecheckS3Bucket.query();
      },
    },
  },
});
