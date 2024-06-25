<script setup lang="ts">
defineProps({
  stats: {
    type: Object as PropType<{
      videos: {
        views: number;
        count: number;
        shortest: number;
        longest: number;
        average: number;
        total: number;
      };
      years?: any;
      people?: any;
    }>,
    required: true,
  },
});
</script>

<template>
  <div class="tw_flex tw_flex-col tw_gap-4">
    <div
      v-for="(item, i) in [
        { label: 'Total Videos', value: stats.videos.count },
        { label: 'Total View Count', value: stats.videos.views },
        { label: 'All People', value: Object.keys(stats.people).length },
        {
          label: 'Average Video Length',
          value: formatDuration(Math.floor(stats.videos.average), 'string'),
        },
        {
          label: 'Total System Length',
          value: formatDuration(Math.floor(stats.videos.total), 'string'),
        },
      ]"
      :key="i"
    >
      <p class="tw_text-base tw_text-gray-500 tw_leading-none">{{ item.label }}</p>
      <p class="tw_text-xl">{{ item.value }}</p>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
