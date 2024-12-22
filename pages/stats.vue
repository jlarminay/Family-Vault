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
        <StatsSummaryCards v-if="stats" :stats="stats" />

        <div class="tw_flex tw_items-start tw_flex-col sm:tw_flex-row tw_gap-4 tw_mt-2">
          <!-- <StatsSummary
            v-if="stats"
            :stats="stats"
            class="tw_w-full sm:tw_min-w-[250px] sm:tw_w-[250px] tw_border tw_rounded tw_p-4"
          /> -->
          <StatsLine
            v-if="stats"
            :stats="stats.year"
            class="tw_border tw_rounded tw_p-4 tw_w-full tw_h-[400px]"
          />
        </div>

        <div class="tw_flex tw_items-start tw_flex-col sm:tw_flex-row tw_gap-4 tw_mt-4">
          <StatsWordCloud
            v-if="stats"
            :stats="stats.people"
            class="tw_w-full tw_border tw_rounded tw_p-4"
          />
        </div>

        <div class="tw_flex tw_items-start tw_flex-col sm:tw_flex-row tw_gap-4 tw_mt-4">
          <StatsMap
            v-if="stats"
            :stats="stats.locations"
            class="tw_w-full tw_border tw_rounded tw_p-4"
          />
        </div>
      </div>
    </main>
  </NuxtLayout>
</template>

<style scoped lang="postcss"></style>
