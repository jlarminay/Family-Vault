<script setup lang="ts">
definePageMeta({
  middleware: 'authorized-only',
});

const statsStore = useStatsStore();
const stats = ref(await statsStore.getAll());
</script>

<template>
  <Head>
    <title>Stats | Larminay Vault</title>
  </Head>

  <NuxtLayout name="app">
    <main class="tw_p-1 sm:tw_px-6 sm:tw_py-4 tw_max-w-[1000px] tw_mx-auto">
      <h1 class="h1">Stats</h1>

      <div class="tw_mt-4">
        <div class="tw_flex tw_items-start tw_flex-col sm:tw_flex-row tw_gap-4">
          <div
            class="tw_w-full sm:tw_min-w-[250px] sm:tw_w-[250px] tw_flex tw_flex-col tw_gap-2 tw_border tw_rounded tw_px-4 tw_py-2"
          >
            <div>
              <p class="tw_text-base tw_text-gray-500">Total Videos</p>
              <p class="tw_text-xl">
                {{ stats.videos.count }}
              </p>
            </div>
            <div>
              <p class="tw_text-base tw_text-gray-500">Total View Count</p>
              <p class="tw_text-xl">
                {{ stats.videos.views }}
              </p>
            </div>
            <div>
              <p class="tw_text-base tw_text-gray-500">Average Video Length</p>
              <p class="tw_text-xl">
                {{ formatDuration(Math.floor(stats.videos.average), 'string') }}
              </p>
            </div>
            <div>
              <p class="tw_text-base tw_text-gray-500">Total System Length</p>
              <p class="tw_text-xl">
                {{ formatDuration(Math.floor(stats.videos.total), 'string') }}
              </p>
            </div>
          </div>
          <div class="tw_border tw_rounded tw_px-4 tw_py-2 tw_w-full tw_aspect-video">
            <StatsLine v-if="stats" :stats="stats.years" class="tw_w-full" />
          </div>
        </div>
        <div class="tw_border tw_rounded tw_flex tw_justify-center tw_mt-4">
          <StatsWordCloud v-if="stats" :stats="stats.people" class="!tw_w-[80%]" />
        </div>
      </div>
    </main>
  </NuxtLayout>
</template>

<style scoped lang="postcss"></style>
