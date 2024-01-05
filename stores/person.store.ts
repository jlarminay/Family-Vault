import { defineStore } from 'pinia';

export const usePersonStore = defineStore('person', {
  state: () => ({}),

  getters: {},

  actions: {
    async getAll() {
      const { $trpc } = useNuxtApp();
      let results = await $trpc.person.getAll.query();
      results = results.map((person: any) => {
        return {
          ...person,
          image: person.image || { path: 'https://placehold.co/600x600' },
        };
      });
      return results;
    },
    async getSingle(id: number) {
      const { $trpc } = useNuxtApp();
      let results = await $trpc.person.getSingle.query({ id });
      return {
        ...results,
        // @ts-ignore
        image: results.image || { path: 'https://placehold.co/600x600' },
      };
    },

    async createOrUpdate(newPerson: any, newImage: any = null) {
      const { $trpc } = useNuxtApp();

      try {
        // check if person has id
        let response;
        if (newPerson.id) {
          // return await this.update(person);
        } else {
          response = await this.create(newPerson);
        }

        // check if person has image
        if (response && newImage?.data?.name.length > 0 && newImage?.error === false) {
          console.log('uploading image');
          await this.uploadImage(response.id, newImage.data, newImage.name);
        }

        return true;
      } catch (err) {
        return false;
      }
    },

    async create(newPerson: any) {
      const { $trpc } = useNuxtApp();
      const results = await $trpc.person.create.mutate(newPerson);
      return results;
    },
    async uploadImage(personId: number, data: string, name: string) {
      const { $trpc } = useNuxtApp();
      // const results = await $trpc.person.uploadImage.mutate({ personId, data, name });
      return true;
    },
  },
});
