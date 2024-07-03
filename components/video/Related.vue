<script setup lang="ts">
const itemStore = useItemStore();
const props = defineProps<{
  videoId: number;
  type: 'ver' | 'hor';
}>();

const relatedVideos = ref(await itemStore.getRelated(props.videoId, 10));
</script>

<template>
  <div>
    <h3 class="h3">Related Videos</h3>

    <div
      class="tw_flex"
      :class="{
        'tw_flex-col': type === 'ver',
        'tw_flex-row tw_overflow-x-scroll tw_pb-2': type === 'hor',
      }"
    >
      <NuxtLink
        v-for="(video, i) in relatedVideos"
        :key="i"
        class="tw_flex tw_items-center tw_p-2 tw_rounded-md tw_overflow-hidden tw_transition hover:tw_bg-slate-200 tw_duration-300"
        :class="{
          'tw_w-full': type === 'ver',
          'tw_min-w-[200px] tw_flex tw_flex-col': type === 'hor',
        }"
        :to="`/video/${video.id}`"
      >
        <div
          class="tw_min-w-[120px] tw_w-[120px] tw_relative"
          :class="{ 'tw_w-full': type === 'hor' }"
        >
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
        <div
          :class="{
            'tw_px-2': type === 'ver',
            'tw_px-1 tw_pt-1 tw_w-full': type === 'hor',
          }"
        >
          <p
            class="tw_font-bold"
            :class="{
              'tw_line-clamp-2': type === 'ver',
              'tw_line-clamp-1': type === 'hor',
            }"
          >
            {{ video.title }}
          </p>
          <p class="tw_text-gray-500 tw_text-sm">
            {{ $dayjs(video.createdAt).format('MMM D, YYYY') }}
          </p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
