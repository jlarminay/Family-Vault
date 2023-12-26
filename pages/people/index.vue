<script setup lang="ts">
definePageMeta({
  middleware: 'authorized-only',
});

const personStore = usePersonStore();
const allPersons = ref(await personStore.getAll());
</script>

<template>
  <Head>
    <title>People | Larminay Vault</title>
  </Head>

  <div>
    <SingleNavMenu />

    <div class="tw_px-6 tw_py-4 tw_max-w-[1400px] tw_mx-auto tw_border">
      <h1 class="h1">People</h1>
      <div class="tw_mt-6 tw_flex tw_flex-wrap tw_max-w-[800px] tw_mx-auto">
        <NuxtLink
          v-for="(person, i) in allPersons"
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
              <img :src="person.image" class="tw_object-cover" />
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
  </div>
</template>

<style scoped lang="postcss"></style>
