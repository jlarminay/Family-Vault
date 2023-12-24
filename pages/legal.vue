<script setup lang="ts">
const { status, data } = useAuth();
definePageMeta({
  title: 'Dashboard',
  middleware: 'authorized-only',
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

    <div class="tw_px-6 tw_py-4 tw_max-w-[1400px] tw_mx-auto tw_border">
      <h1 class="h1">Legal</h1>
      <div class="tw_mt-6">Coming soon</div>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
