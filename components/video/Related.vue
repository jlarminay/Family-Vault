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
    class="tw_flex tw_items-center tw_mt-4 tw_rounded-md tw_overflow-hidden tw_transition hover:tw_bg-slate-200 tw_duration-300"
    :to="`/video/${video.id}`"
  >
    <div class="tw_min-w-[120px] tw_w-[120px] tw_relative">
      <img
        :src="video.thumbnail.path"
        class="tw_w-full tw_object-cover tw_aspect-video tw_rounded"
      />
      <span
        class="tw_absolute tw_bottom-0 tw_right-0 tw_px-2 tw_p-0.5 tw_bg-black tw_bg-opacity-60 tw_text-white tw_rounded-tl tw_rounded-br"
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
