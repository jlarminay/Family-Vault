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
  <div class="tw_flex tw_flex-wrap">
    <div
      v-for="(val, i) in [
        { label: 'Total File Size', value: formatSize(stats.totalFileSize), icon: 'o_save' },
        { label: 'Total Images', value: stats.images.count, icon: 'o_image' },
        { label: 'Total Videos', value: stats.videos.count, icon: 'o_movie' },
        {
          label: 'Total Videos Length',
          value: formatDuration(stats.videos.totalLength, 'string'),
          icon: 'o_timer',
        },
      ]"
      :key="i"
      class="tw_p-2 first:tw_ml-0 last:tw_mr-0 tw_w-1/2 md:tw_w-1/4"
    >
      <div class="tw_border tw_p-4 tw_rounded-md tw_relative tw_overflow-hidden tw_min-h-[100px]">
        <p class="tw_text-base tw_text-gray-500 tw_leading-none">{{ val.label }}</p>
        <h2 class="h2 tw_font-bold">{{ val.value }}</h2>
        <q-icon
          :name="val.icon"
          color="dark"
          size="150px"
          class="tw_absolute tw_right-[-30px] tw_top-0 tw_opacity-15 tw_z-0 tw_pointer-events-none"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
