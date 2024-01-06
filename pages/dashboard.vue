<script setup lang="ts">
const route = useRoute();
definePageMeta({
  middleware: 'authorized-only',
});

const videoStore = useVideoStore();
const allVideos = await videoStore.getAllPublic();

const cleanedAllVideos = computed(() => {
  if (route.query?.search) {
    return allVideos.filter((video: any) => {
      return video.title.toLowerCase().includes(route.query?.search?.toString().toLowerCase());
    });
  }
  return allVideos;
});
</script>

<template>
  <Head>
    <title>Dashboard | Larminay Vault</title>
  </Head>

  <div>
    <SingleNavMenu />

    <main class="tw_px-6 tw_py-4 tw_max-w-[1400px] tw_mx-auto tw_border">
      <h1 class="h1">Dashboard</h1>
      <div class="tw_flex tw_gap-0 tw_justify-start tw_mt-6 tw_flex-wrap tw_items-start">
        <DashboardItem v-for="(video, i) in cleanedAllVideos" :key="i" :video="video" />
      </div>
    </main>
  </div>
</template>

<style scoped lang="postcss"></style>
