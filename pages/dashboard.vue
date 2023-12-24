<script setup lang="ts">
const { status, data } = useAuth();
definePageMeta({
  title: 'Dashboard',
});

const videoStore = useVideoStore();
const allVideos = await videoStore.getAll();

const cleanedAllVideos = computed(() => {
  return allVideos;
});
</script>

<template>
  <div>
    <SingleNavMenu />

    <pre>{{ status }}</pre>
    <pre>{{ data }}</pre>

    <div class="tw_px-6 tw_py-4 tw_max-w-[1400px] tw_mx-auto tw_border">
      <h1 class="h1">Dashboard</h1>
      <div class="tw_flex tw_gap-4 tw_justify-between tw_mt-6">
        <DashboardItem v-for="(video, i) in cleanedAllVideos" :key="i" :video="video" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
