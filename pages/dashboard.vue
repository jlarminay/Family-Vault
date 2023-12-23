<script setup lang="ts">
definePageMeta({
  title: 'Dashboard',
});

const videoStore = useVideoStore();
const allVideos = await videoStore.getAll();
</script>

<template>
  <div>
    <SingleNavMenu />

    <div class="tw_px-6 tw_py-4 tw_max-w-[1000px] tw_mx-auto tw_border">
      <h1 class="h1">Dashboard</h1>
      <pre>{{ allVideos }}</pre>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
