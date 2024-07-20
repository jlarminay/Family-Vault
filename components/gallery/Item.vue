<script setup lang="ts">
import dayjs from 'dayjs';

defineProps({
  item: {
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
  <a
    class="tw_inline-block tw_rounded tw_overflow-hidden tw_transition hover:tw_bg-slate-200 tw_cursor-pointer"
    :class="{
      'tw_p-1 sm:tw_p-2': !expandedView,
      'tw_p-2': expandedView,
    }"
    :data-lg-size="item.metadata.resolution.replace('x', '-')"
    :data-src="item.type === 'video' ? null : item.path"
    :data-video="
      item.type === 'video'
        ? `{&quot;source&quot;: [{&quot;src&quot;:&quot;${item.path}&quot;, &quot;type&quot;:&quot;video/mp4&quot;}], &quot;attributes&quot;: {&quot;preload&quot;: true, &quot;controls&quot;: true}}`
        : null
    "
    :data-poster="item.type === 'video' ? `${item.path}.thumbnail.webp` : null"
    :ariaDescribedby="item.description"
  >
    <div class="tw_relative tw_rounded">
      <img
        :src="`${item.path}.thumbnail.webp`"
        class="tw_w-full tw_aspect-video tw_object-cover tw_rounded"
      />
      <span
        v-if="item.status !== 'processing' && item.type === 'video'"
        class="tw_absolute tw_bottom-0 tw_right-0 tw_px-2 tw_p-0.5 tw_bg-black tw_bg-opacity-60 tw_text-white tw_rounded-tl tw_rounded-br"
      >
        {{ formatDuration(item.metadata?.duration) }}
      </span>
      <div v-if="item.published !== 'public'" class="tw_absolute tw_top-1 tw_left-1">
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
    <div v-if="expandedView" class="tw_mt-0.5">
      <p class="tw_text-xs sm:tw_text-sm tw_flex tw_items-center tw_gap-1 tw_text-gray-500">
        <q-icon name="o_calendar_month" class="tw_hidden sm:tw_block" />
        {{ dayjs(item.takenAt).format('MMM D, YYYY') }}
        {{ item.dateEstimate ? '(est.)' : '' }}
      </p>
      <p class="tw_text-xs sm:tw_text-sm tw_line-clamp-2">{{ item.description }}</p>
    </div>
  </a>
</template>

<style scoped lang="postcss"></style>
