<script setup lang="ts">
import dayjs from 'dayjs';
defineProps({
  video: {
    type: Object,
    required: true,
  },
  liked: {
    type: Boolean,
    default: false,
  },
  expandedView: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <NuxtLink
    class="tw_inline-block tw_w-full tw_rounded tw_overflow-hidden tw_transition hover:tw_bg-slate-200 tw_p-2"
    :class="{ 'tw_cursor-not-allowed tw_opacity-70': video.status === 'processing' }"
    :to="video.status === 'processing' ? '' : `/video/${video.id}`"
  >
    <div class="tw_relative tw_rounded">
      <img
        :src="video.thumbnail.path"
        class="tw_w-full tw_aspect-video tw_object-cover tw_rounded"
      />
      <span
        v-if="video.status !== 'processing'"
        class="tw_absolute tw_bottom-0 tw_right-0 tw_px-2 tw_p-0.5 tw_bg-black tw_bg-opacity-60 tw_text-white tw_rounded-tl tw_rounded-br"
      >
        {{ formatDuration(video.video?.metadata?.duration) }}
      </span>
      <div v-if="video.published !== 'public'" class="tw_absolute tw_top-1 tw_left-1">
        <q-icon
          name="lock"
          class="tw_absolute tw_text-white tw_blur-[2px] tw_opacity-30 tw_text-2xl tw_rounded-full tw_p-0.5"
        />
        <q-icon
          name="lock"
          class="tw_absolute tw_text-primary tw_text-2xl tw_rounded-full tw_p-0.5"
        />
      </div>
      <div v-if="liked" class="tw_absolute tw_top-1 tw_right-1">
        <q-icon
          name="o_favorite"
          class="tw_absolute tw_right-0 tw_text-white tw_blur-[2px] tw_opacity-30 tw_text-2xl tw_rounded-full tw_p-0.5"
        />
        <q-icon
          name="o_favorite"
          class="tw_absolute tw_right-0 tw_text-red-600 tw_text-2xl tw_rounded-full tw_p-0.5"
        />
      </div>
    </div>
    <div class="tw_mt-2">
      <p class="tw_text-gray-500 tw_text-sm sm:tw_text-xs tw_truncate">
        <b v-if="expandedView">Display:</b>
        {{ video.dateDisplay }}
        <!-- • {{ formatViews(video.views, 'sm') }} views -->
      </p>
      <p v-if="expandedView" class="tw_text-gray-500 tw_text-sm sm:tw_text-xs tw_truncate">
        <b>Order:</b>
        {{ video.dateOrder }}
      </p>
      <p class="tw_text-lg sm:tw_text-base !tw_leading-tight tw_line-clamp-2 tw_font-bold">
        {{ video.title }}
      </p>
      <p class="tw_text-gray-500 tw_text-base sm:tw_text-sm tw_line-clamp-2">
        <b v-if="expandedView">Desc:</b>
        {{ video.description || '-' }}
      </p>
      <p v-if="expandedView" class="tw_text-gray-500 tw_text-base sm:tw_text-sm tw_line-clamp-2">
        <b>People:</b>
        {{ video.people || '-' }}
      </p>
      <p v-if="expandedView" class="tw_text-gray-500 tw_text-base sm:tw_text-sm tw_line-clamp-2">
        <b>File:</b>
        {{ video.video.name }}
      </p>
    </div>
  </NuxtLink>
</template>

<style scoped lang="postcss"></style>
