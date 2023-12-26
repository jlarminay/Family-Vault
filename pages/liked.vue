<script setup lang="ts">
definePageMeta({
  middleware: 'authorized-only',
});

const videoStore = useVideoStore();
const allVideos = await videoStore.getLiked();
</script>

<template>
  <Head>
    <title>Liked Videos | Larminay Vault</title>
  </Head>

  <div>
    <SingleNavMenu />

    <div class="tw_px-6 tw_py-4 tw_max-w-[1400px] tw_mx-auto tw_border">
      <h1 class="h1">Liked Videos</h1>
      <div class="tw_flex tw_gap-0 tw_justify-start tw_mt-6 tw_flex-wrap tw_items-start">
        <DashboardItem v-for="(video, i) in allVideos" :key="i" :video="video" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
