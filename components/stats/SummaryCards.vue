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
  <div class="tw_flex">
    <div
      v-for="(val, i) in [
        { label: 'Total File Size', value: formatSize(stats.totalFileSize), icon: 'sym_o_save' },
        { label: 'Total Videos', value: stats.videos.count, icon: 'sym_o_movie' },
        {
          label: 'Total Videos Length',
          value: formatDuration(stats.videos.totalLength, 'string'),
          icon: 'sym_o_timer',
        },
        { label: 'Total Images', value: stats.images.count, icon: 'sym_o_imagesmode' },
      ]"
      :key="i"
      class="tw_m-2 first:tw_ml-0 last:tw_mr-0 tw_w-1/4"
    >
      <div class="tw_border tw_p-4 tw_rounded-md tw_pb-10 tw_relative tw_overflow-hidden">
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
