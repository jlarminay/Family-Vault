<script setup lang="ts">
defineProps({
  video: {
    type: Object,
    required: true,
  },
  liked: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="min-[1200px]:tw_w-1/5 min-[1000px]:tw_w-1/4 min-[800px]:tw_w-1/3 tw_w-1/2 tw_pr-4">
    <NuxtLink
      class="tw_inline-block tw_w-full tw_border tw_rounded-md tw_overflow-hidden hover:tw_scale-[1.02] tw_transition tw_duration-300"
      :to="`/video/${video.id}`"
    >
      <div class="tw_relative">
        <img :src="video.thumbnail.path" class="tw_w-full tw_aspect-video tw_object-cover" />
        <span
          class="tw_absolute tw_bottom-0 tw_right-0 tw_px-2 tw_p-0.5 tw_bg-black tw_bg-opacity-60 tw_text-white tw_rounded-tl-md"
        >
          {{ formatDuration(video.video?.metadata?.duration) }}
        </span>
        <q-icon
          v-if="!video.published"
          name="sym_o_lock"
          class="tw_absolute tw_top-1 tw_left-1 tw_text-white tw_bg-red-600 tw_text-xl tw_rounded-full tw_p-1"
        />
        <q-icon
          v-if="liked"
          name="o_favorite"
          class="tw_absolute tw_top-1 tw_right-1 tw_text-red-600 tw_text-xl tw_rounded-full tw_p-1"
        />
      </div>
      <div class="tw_p-2">
        <p class="tw_text-base tw_truncate tw_font-bold">{{ video.title }}</p>
        <p class="tw_text-gray-500 tw_text-sm tw_truncate">
          <!-- {{ $dayjs(video.createdAt).format('MMM D, YYYY') }} -->
          {{ video.dateDisplay }}
        </p>
      </div>
    </NuxtLink>
  </div>
</template>

<style scoped lang="postcss"></style>
