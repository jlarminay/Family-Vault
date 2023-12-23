<script setup lang="ts">
const props = defineProps({
  video: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <NuxtLink
    class="tw_w-[300px] tw_border tw_rounded-md tw_overflow-hidden hover:tw_scale-105 tw_transition tw_duration-200"
    :to="`/video/${video.id}`"
  >
    <div class="tw_relative">
      <img
        :src="video.thumbnail || 'https://placehold.co/640x360'"
        class="tw_w-full tw_aspect-video tw_object-cover"
      />
      <span
        class="tw_absolute tw_bottom-0 tw_right-0 tw_px-2 tw_p-0.5 tw_bg-black tw_bg-opacity-60 tw_text-white tw_rounded-tl-md"
      >
        {{ formatDuration(video.duration) }}
      </span>
    </div>
    <div class="tw_p-2">
      <p class="tw_text-xl tw_truncate tw_font-bold">{{ video.title }}</p>
      <p class="tw_text-gray-500 tw_text-sm">
        {{ $dayjs(video.createdAt).format('MMM D, YYYY') }}
      </p>
    </div>
  </NuxtLink>
</template>

<style scoped lang="postcss"></style>
