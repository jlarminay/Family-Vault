<script setup lang="ts">
definePageMeta({
  middleware: 'authorized-only',
});

const statsStore = useStatsStore();
const stats = ref(await statsStore.getAll());
const method = ref<'clips' | 'duration'>('clips');
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
            class="tw_w-full sm:tw_min-w-[250px] sm:tw_w-[250px] tw_border tw_rounded tw_px-4 tw_py-2"
          >
            <StatsSummary v-if="stats" :stats="stats" />
          </div>
          <div class="tw_border tw_rounded tw_px-4 tw_py-2 tw_w-full tw_aspect-video">
            <StatsLine
              v-if="stats"
              :stats="stats.year"
              :displayType="method"
              @clips="method = 'clips'"
              @duration="method = 'duration'"
              class="tw_w-full"
            />
          </div>
        </div>
        <div class="tw_flex tw_items-start tw_flex-col sm:tw_flex-row tw_gap-4 tw_mt-4">
          <div class="tw_w-full tw_border tw_rounded tw_px-4 tw_py-2">
            <StatsWordCloud
              v-if="stats"
              :stats="stats.people"
              :displayType="method"
              @clips="method = 'clips'"
              @duration="method = 'duration'"
            />
          </div>
          <div
            class="tw_w-full sm:tw_min-w-[300px] sm:tw_w-[300px] tw_border tw_rounded tw_px-4 tw_py-2"
          >
            <StatsPie
              v-if="stats"
              :stats="stats.format"
              :displayType="method"
              @clips="method = 'clips'"
              @duration="method = 'duration'"
            />
          </div>
        </div>
      </div>
    </main>
  </NuxtLayout>
</template>

<style scoped lang="postcss"></style>
