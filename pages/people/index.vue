<script setup lang="ts">
definePageMeta({
  middleware: 'authorized-only',
});

const personStore = usePersonStore();
const allPersons = ref(await personStore.getAll());
const search = ref('');
const editModal = ref(false);

const cleanedPersons = computed(() => {
  if (search.value === '') return allPersons.value;

  return allPersons.value.filter((person: any) => {
    return person.name.toLowerCase().includes(search.value.toLowerCase());
  });
});

async function refreshData() {
  allPersons.value = await personStore.getAll();
}
</script>

<template>
  <Head>
    <title>People | Larminay Vault</title>
  </Head>

  <SingleNavMenu />

  <div class="tw_px-6 tw_py-4 tw_max-w-[800px] tw_mx-auto">
    <div class="tw_flex tw_justify-between tw_items-start">
      <h1 class="h1">People</h1>
      <div class="tw_flex tw_items-center tw_justify-end tw_gap-2 tw_flex-1">
        <q-btn color="primary" unelevated @click="editModal = true">
          <q-icon name="sym_o_add" class="tw_mr-1" />
          New
        </q-btn>
        <q-input
          outlined
          dense
          v-model="search"
          placeholder="Search..."
          class="tw_w-full tw_max-w-[200px] tw_my-0"
        />
      </div>
    </div>

    <div class="tw_mt-6 tw_flex tw_flex-wrap">
      <NuxtLink
        v-for="(person, i) in cleanedPersons"
        :key="i"
        class="tw_mb-4 tw_pr-2 tw_w-1/2"
        :to="`/people/${person.id}`"
      >
        <div
          class="tw_flex tw_items-center tw_gap-4 tw_p-2 tw_rounded-xl hover:tw_bg-gray-100 tw_transition-colors tw_duration-300"
        >
          <div
            class="tw_w-[100px] tw_h-[100px] tw_rounded-full tw_overflow-hidden tw_border-4"
            :class="{
              'tw_border-red-400': person.gender === 'Female',
              'tw_border-blue-400': person.gender === 'Male',
              'tw_border-purple-400': person.gender === 'Other',
            }"
          >
            <img :src="person.image.path" class="tw_object-cover" />
          </div>
          <div class="tw_flex-1">
            <p class="tw_text-xl">{{ person.name }}</p>
            <p>{{ $dayjs(person.birthday).format('MMM D, YYYY') }}</p>
            <p class="tw_text-sm tw_opacity-80">{{ person.videos }} videos</p>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>

  <PersonEditModal v-model="editModal" mode="new" @personUpdated="refreshData" />
</template>

<style scoped lang="postcss"></style>
