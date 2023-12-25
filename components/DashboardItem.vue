<script setup lang="ts">
defineProps({
  video: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="min-[1200px]:tw_w-1/5 min-[1000px]:tw_w-1/4 min-[800px]:tw_w-1/3 tw_w-1/2 tw_p-4">
    <NuxtLink
      class="tw_inline-block tw_w-full tw_border tw_rounded-md tw_overflow-hidden hover:tw_scale-[1.02] tw_transition tw_duration-300"
      :to="`/video/${video.id}`"
    >
      <div class="tw_relative">
        <img :src="video.thumbnail" class="tw_w-full tw_aspect-video tw_object-cover" />
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
  </div>
</template>

<style scoped lang="postcss"></style>
