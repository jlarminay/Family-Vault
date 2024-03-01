<script setup lang="ts">
defineProps({
  video: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <NuxtLink
    class="tw_flex tw_items-center tw_mt-4 tw_border tw_rounded-md tw_overflow-hidden hover:tw_scale-[1.02] tw_transition tw_duration-300"
    :to="`/video/${video.id}`"
  >
    <div class="tw_min-w-[100px] tw_w-[100px] tw_relative">
      <img :src="video.thumbnail.path" class="tw_h-[75px] tw_object-cover" />
      <span
        class="tw_absolute tw_bottom-0 tw_right-0 tw_px-2 tw_p-0.5 tw_bg-black tw_bg-opacity-60 tw_text-white tw_rounded-tl-md"
      >
        {{ formatDuration(video.video.metadata.duration) }}
      </span>
    </div>
    <div class="tw_px-2">
      <p class="tw_font-bold tw_line-clamp-2">{{ video.title }}</p>
      <p class="tw_text-gray-500 tw_text-sm">
        {{ $dayjs(video.createdAt).format('MMM D, YYYY') }}
      </p>
    </div>
  </NuxtLink>
</template>

<style scoped lang="postcss"></style>
