<script setup lang="ts">
const props = defineProps<{
  stats: {
    views: number;
    totalFileSize: number;
    videos: {
      count: number;
      totalLength: number;
      averageLength: number;
    };
    images: {
      count: number;
    };
    people?: { [key: string]: number };
    years?: { [key: string]: { images: number; videos: number } };
    locations?: { lat: number; lng: number }[];
  };
}>();
</script>

<template>
  <div class="tw_flex tw_flex-col tw_gap-4">
    <!-- General -->
    <div>
      <p class="tw_text-base tw_text-gray-500 tw_leading-none">Total Items Count</p>
      <p class="tw_text-xl">{{ stats.videos.count + stats.images.count }}</p>
    </div>
    <div>
      <p class="tw_text-base tw_text-gray-500 tw_leading-none">Total File Size</p>
      <p class="tw_text-xl">{{ formatSize(stats.totalFileSize) }}</p>
    </div>
    <!-- <div>
      <p class="tw_text-base tw_text-gray-500 tw_leading-none">Total Views</p>
      <p class="tw_text-xl">{{ stats.views }}</p>
    </div> -->

    <!-- Videos -->
    <div class="tw_pt-4 tw_border-t">
      <p class="tw_text-base tw_text-gray-500 tw_leading-none">Total Videos</p>
      <p class="tw_text-xl">{{ stats.videos.count }}</p>
    </div>
    <div>
      <p class="tw_text-base tw_text-gray-500 tw_leading-none">Total Videos Length</p>
      <p class="tw_text-xl">{{ formatDuration(stats.videos.totalLength, 'string') }}</p>
    </div>
    <!-- <div>
      <p class="tw_text-base tw_text-gray-500 tw_leading-none">Average Videos Length</p>
      <p class="tw_text-xl">{{ formatDuration(stats.videos.averageLength, 'string') }}</p>
    </div> -->

    <!-- Images -->
    <div class="tw_pt-4 tw_border-t">
      <p class="tw_text-base tw_text-gray-500 tw_leading-none">Total Images</p>
      <p class="tw_text-xl">{{ stats.images.count }}</p>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
