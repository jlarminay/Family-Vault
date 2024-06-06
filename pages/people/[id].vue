<script setup lang="ts">
definePageMeta({
  middleware: 'authorized-only',
});
const route = useRoute();
const personStore = usePersonStore();

const personId = ref(parseInt(route.params.id as string));
const person = ref(await personStore.getSingle(personId.value));
</script>

<template>
  <Head>
    <title>Person | Larminay Vault</title>
  </Head>

  <NuxtLayout name="app">
    <main class="tw_px-6 tw_py-4 tw_max-w-[800px] tw_mx-auto">
      <div class="tw_flex tw_flex-wrap">
        <div class="tw_flex tw_items-center tw_gap-4">
          <div
            class="tw_border-8 tw_rounded-full tw_overflow-hidden tw_w-[200px] tw_h-[200px]"
            :class="{
              'tw_border-red-400': person.gender === 'Female',
              'tw_border-blue-400': person.gender === 'Male',
              'tw_border-purple-400': person.gender === 'Other',
            }"
          >
            <img :src="person.image.path" class="tw_object-cover" />
          </div>
          <div>
            <div class="tw_flex tw_items-center tw_gap-2">
              <h1 class="h1">{{ person.name }}</h1>
              <q-btn
                color="primary"
                round
                flat
                size="12px"
                disable
                icon="sym_o_edit"
                :to="`/people/${person.id}/edit`"
              />
            </div>
            <p class="tw_text-lg">Birthday: {{ $dayjs(person.birthday).format('MMMM D, YYYY') }}</p>
            <p class="tw_text-lg">Gender: {{ person.gender }}</p>
          </div>
        </div>
      </div>

      <div class="tw_mt-10">
        <h2 class="h2">
          Videos they are in <span class="tw_text-lg">({{ person.videos.length }})</span>
        </h2>
        <div
          v-if="person.videos.length > 0"
          class="tw_flex tw_gap-0 tw_justify-start tw_mt-4 tw_flex-wrap tw_items-start"
        >
          <DashboardItem v-for="(video, i) in person.videos" :key="i" :video="video" />
        </div>
        <div v-else class="tw_text-center tw_mt-4">
          <p class="tw_text-lg tw_italic tw_opacity-70">No Videos Found</p>
        </div>
      </div>
    </main>
  </NuxtLayout>
</template>

<style scoped lang="postcss"></style>
