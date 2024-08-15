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
  };
}>();

const displayItems = computed(() => {
  return [
    [
      { label: 'Total Items Count', value: props.stats.videos.count + props.stats.images.count },
      { label: 'Total File Size', value: formatSize(props.stats.totalFileSize) },
      { label: 'Total Views', value: props.stats.views },
    ],
    [
      { label: 'Total Videos', value: props.stats.videos.count },
      {
        label: 'All Videos Length',
        value: formatDuration(Math.floor(props.stats.videos.totalLength), 'string'),
      },
      {
        label: 'Average Video Length',
        value: formatDuration(Math.floor(props.stats.videos.averageLength), 'string'),
      },
    ],
    [{ label: 'Total Images', value: props.stats.images.count }],
  ];
});
</script>

<template>
  <div class="tw_flex tw_w-full">
    <div v-for="(category, i) in displayItems" class="tw_flex tw_flex-col tw_gap-4 tw_w-1/3">
      <div v-for="(item, i) in category" :key="i">
        <p class="tw_text-base tw_text-gray-500 tw_leading-none">{{ item.label }}</p>
        <p class="tw_text-xl">{{ item.value }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
