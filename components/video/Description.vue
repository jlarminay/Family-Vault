<script setup lang="ts">
defineProps({
  video: {
    type: Object,
    required: true,
  },
});
const showMore = ref<boolean>(false);
</script>

<template>
  <div class="tw_mt-4">
    <div :class="{ 'tw_line-clamp-3': !showMore }">
      <!-- Description -->
      <p class="tw_whitespace-pre-line" :class="{ 'tw_opacity-70 tw_italic': !video.description }">
        {{ video.description || 'No Description' }}
      </p>

      <!-- More information -->
      <div v-if="showMore" class="tw_mt-6">
        <div class="tw_flex tw_gap-2">
          <span class="tw_font-bold">People: </span>
          <span :class="{ 'tw_opacity-70 tw_italic': !video.people }">
            {{ video.people || 'None' }}
          </span>
        </div>
        <div class="tw_flex tw_gap-2">
          <span class="tw_font-bold">Tags: </span>
          <span :class="{ 'tw_opacity-70 tw_italic': !video.tags }">
            {{ video.tags || 'None' }}
          </span>
        </div>
        <div class="tw_flex tw_gap-2">
          <span class="tw_font-bold">Order Date: </span>
          <span>{{ video.dateOrder }}</span>
        </div>
        <div class="tw_flex tw_gap-2">
          <span class="tw_font-bold">File Name: </span>
          <span>{{ video.video.name }}</span>
        </div>
        <div class="tw_flex tw_gap-2">
          <span class="tw_font-bold">Video Resolution: </span>
          <span>
            {{ video.video.metadata.resolution }} ({{
              getAspectRatio(video.video.metadata.resolution)
            }})
          </span>
        </div>
        <div class="tw_flex tw_gap-2">
          <span class="tw_font-bold">Video Size: </span>
          <span>{{ formatSize(video.video.size) }}</span>
        </div>
        <div class="tw_flex tw_gap-2">
          <span class="tw_font-bold">Uploaded By: </span>
          <span>{{ video.owner.name }}</span>
        </div>
        <div class="tw_flex tw_gap-2">
          <span class="tw_font-bold">Uploaded Date: </span>
          <span>{{ $dayjs(video.createdAt).format('MMMM D, YYYY') }}</span>
        </div>
      </div>
    </div>

    <div class="tw_text-center tw_mt-2">
      <q-btn
        no-caps
        unelevated
        :size="$q.screen.lt.sm ? '10px' : '12px'"
        color="primary"
        @click="showMore = !showMore"
      >
        {{ showMore ? 'Show Less' : 'Show More' }}
      </q-btn>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
