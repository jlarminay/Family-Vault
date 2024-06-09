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
  <NuxtLink
    class="tw_inline-block tw_w-full tw_rounded tw_overflow-hidden tw_transition hover:tw_bg-slate-200 tw_p-2"
    :to="`/video/${video.id}`"
  >
    <div class="tw_relative tw_rounded">
      <img
        :src="video.thumbnail.path"
        class="tw_w-full tw_aspect-video tw_object-cover tw_rounded"
      />
      <span
        class="tw_absolute tw_bottom-0 tw_right-0 tw_px-2 tw_p-0.5 tw_bg-black tw_bg-opacity-60 tw_text-white tw_rounded-tl tw_rounded-br"
      >
        {{ formatDuration(video.video?.metadata?.duration) }}
      </span>
      <q-icon
        v-if="video.published === 'private'"
        name="sym_o_lock"
        class="tw_absolute tw_top-1 tw_left-1 tw_text-white tw_bg-red-600 tw_text-xl tw_rounded-full tw_p-1"
      />
      <q-icon
        v-if="liked"
        name="o_favorite"
        class="tw_absolute tw_top-1 tw_right-1 tw_text-red-600 tw_text-xl tw_rounded-full tw_p-1"
      />
    </div>
    <div class="tw_mt-2">
      <p class="tw_text-base tw_leading-tight tw_line-clamp-2 tw_font-bold">
        {{ video.title }}
      </p>
      <p class="tw_text-gray-500 tw_text-sm tw_truncate">
        <!-- {{ $dayjs(video.createdAt).format('MMM D, YYYY') }} -->
        {{ video.dateDisplay }}
      </p>
    </div>
  </NuxtLink>
</template>

<style scoped lang="postcss"></style>
