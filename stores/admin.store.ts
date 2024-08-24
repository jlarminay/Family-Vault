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

    // system logs (R)
    ...{
      async systemLogsRead() {
        const { $trpc } = useNuxtApp();
        return await $trpc.admin.systemLogRead.query();
      },
    },

    // force recheck s3 bucket
    ...{
      async s3Action(type: string) {
        const { $trpc } = useNuxtApp();

        switch (type) {
          case 'forceRecheckS3Bucket':
            return await $trpc.admin.forceRecheckS3Bucket.query();
          case 'getAllFiles':
            return await $trpc.admin.getAllFiles.query();
          case 'updateThumbnail':
            return await $trpc.admin.refreshAllThumbnails.query();
          case 'updatePermissions':
            return await $trpc.admin.updatePermissions.query();
        }
      },
    },
  },
});
