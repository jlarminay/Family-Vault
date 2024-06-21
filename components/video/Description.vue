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
    <div
      class="tw_text-base tw_font-maven-pro tw_font-normal tw_leading-tight"
      :class="{ 'tw_line-clamp-3': !showMore }"
    >
      <!-- Description -->
      <p class="tw_whitespace-pre-line" :class="{ 'tw_opacity-70 tw_italic': !video.description }">
        {{ video.description || 'No Description' }}
      </p>

      <!-- More information -->
      <div class="tw_mt-2">
        <div class="tw_flex tw_gap-2">
          <span class="tw_font-bold">People: </span>
          <div v-if="!video.people" class="tw_opacity-70 tw_italic">None</div>
          <div v-else class="tw_flex tw_gap-2">
            <NuxtLink
              v-for="person in video.people.split(',')"
              :key="person"
              class="link"
              :to="`/dashboard?search=${person.trim()}`"
            >
              {{ person.trim() }}
            </NuxtLink>
          </div>
        </div>
        <div v-if="showMore">
          <div class="tw_flex tw_gap-2">
            <span class="tw_font-bold">Order Date: </span>
            <span>{{ video.dateOrder }}</span>
          </div>
          <div class="tw_flex tw_gap-2">
            <span class="tw_font-bold">Collection: </span>
            <NuxtLink class="link" :to="`/dashboard?search=file:${video.video.name.split('.')[0]}`">
              {{ video.video.name.split('.')[0] }}
            </NuxtLink>
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
    </div>

    <div class="tw_text-center tw_mt-4">
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
