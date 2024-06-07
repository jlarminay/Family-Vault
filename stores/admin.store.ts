import { defineStore } from 'pinia';
import video from '~/prisma/seeds/video';

export const useAdminStore = defineStore('admin', {
  state: () => ({}),

  getters: {},

  actions: {
    // video (RU)
    ...{
      async videoRead() {
        const { $trpc } = useNuxtApp();
        return await $trpc.admin.videoRead.query();
      },
      async videoUpdate(video: any) {
        const { $trpc } = useNuxtApp();
        return await $trpc.admin.videoUpdate.mutate(video);
      },
    },

    // file (R)
    ...{
      async filesRead() {
        const { $trpc } = useNuxtApp();
        return await $trpc.admin.filesRead.query();
      },
    },

    // collection (CRUD)
    ...{
      async collectionCreate(collection: any) {
        const { $trpc } = useNuxtApp();
        return await $trpc.admin.collectionCreate.mutate(collection);
      },
      async collectionRead() {
        const { $trpc } = useNuxtApp();
        return await $trpc.admin.collectionRead.query();
      },
      async collectionUpdate(collection: any) {
        const { $trpc } = useNuxtApp();
        return await $trpc.admin.collectionUpdate.mutate(collection);
      },

      async collectionDelete(id: number) {
        const { $trpc } = useNuxtApp();
        return await $trpc.admin.collectionDelete.mutate({ id });
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

    // report (RD)
    ...{
      async reportRead() {
        const { $trpc } = useNuxtApp();
        return await $trpc.admin.reportRead.query();
      },
      async reportDelete(id: number) {
        const { $trpc } = useNuxtApp();
        return await $trpc.admin.reportDelete.mutate({ id });
      },
    },
  },
});
