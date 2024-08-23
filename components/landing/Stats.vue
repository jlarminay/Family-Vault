<script setup lang="ts">
const statsStore = useStatsStore();

const stats = ref({
  views: 0,
  videos: 0,
  videosLength: 0,
  images: 0,
});

onMounted(async () => {
  stats.value = await statsStore.getPublic();
});
</script>

<template>
  <section class="tw_text-gray-600 tw_body-font">
    <div class="tw_container tw_px-5 tw_py-24 tw_mx-auto">
      <div class="tw_flex tw_flex-wrap -tw_m-4 tw_text-center">
        <div class="tw_p-4 sm:tw_w-1/3 tw_w-full">
          <LandingStatsCounter label="Images" :count="stats.images || 0" />
        </div>
        <div class="tw_p-4 sm:tw_w-1/3 tw_w-full">
          <LandingStatsCounter label="Videos" :count="stats.videos || 0" />
        </div>
        <div class="tw_p-4 sm:tw_w-1/3 tw_w-full">
          <LandingStatsCounter
            :label="`${stats.videosLength > 3600 ? 'Hours' : 'Minutes'} of Video`"
            :count="(stats.videosLength > 3600 ? stats.videosLength / 3600 : stats.videosLength / 60) || 0"
          />
        </div>
        <!-- <div class="tw_p-4 sm:tw_w-1/3 tw_w-full">
          <LandingStatsCounter label="Views" :count="stats.views" />
        </div> -->
      </div>
      <div class="tw_text-center tw_text-xl">More are being added every day!</div>
    </div>
  </section>
</template>

<style scoped lang="postcss"></style>
