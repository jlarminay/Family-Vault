import { defineStore } from 'pinia';

export const useItemStore = defineStore('item', {
  state: () => ({
    showUploadModal: false,
  }),

  getters: {},

  actions: {
    async search(options: any) {
      const { $trpc } = useNuxtApp();

      return await $trpc.item.search.query(options);
    },

    // async getRelated(currentId: number, limit: number) {
    //   const { $trpc } = useNuxtApp();

    //   let results = await $trpc.item.getRelated.query({ currentId, limit });
    //   return results;
    // },

    async getSingle(id: string) {
      const { $trpc } = useNuxtApp();

      return await $trpc.item.getSingle.query({ id: parseInt(id) });
    },

    async incrementViewCount(id: number) {
      const { $trpc } = useNuxtApp();
      return await $trpc.item.incrementViewCount.mutate({ id });
    },

    async update(itemData: any) {
      const { $trpc } = useNuxtApp();

      // check if new location is empty
      if (itemData.newLocation && !itemData.newLocation.name && !itemData.newLocation.latLong) {
        itemData.newLocation = null;
      }

      const newVideoData = {
        id: itemData.id,
        description: itemData.description,
        people: itemData.people,
        takenAt: itemData.takenAt,
        dateEstimate: itemData.dateEstimate,
        locationId: itemData.locationId,
        newLocation: itemData.newLocation,
        published: itemData.published,
        allowList: itemData.allowList ? itemData.allowList.map((user: any) => user.value) : [],
      };

      return await $trpc.item.update.mutate(newVideoData);
    },
  },
});
