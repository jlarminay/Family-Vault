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
  <div class="tw_mt-2">
    <div
      v-if="video.published !== 'public'"
      class="tw_border-2 tw_rounded tw_border-orange-200 tw_bg-orange-50 tw_px-4 tw_py-2 tw_flex tw_justify-start tw_items-center tw_gap-4"
    >
      <q-icon name="lock" class="tw_text-primary tw_text-2xl" />
      <p v-if="video.published === 'private'" class="tw_text-lg tw_leading-tight">
        This video is marked as private. Only you can see it.
      </p>
      <p v-if="video.published === 'allow-few'" class="tw_text-lg tw_leading-tight">
        This video is marked as private. Only a few people can see it including:
        {{ video.allowList.map((u: any) => u.name).join(', ') }}.
      </p>
    </div>

    <div
      class="tw_text-base tw_font-maven-pro tw_font-normal tw_leading-tight tw_mt-3"
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
          <div v-else class="tw_flex tw_gap-x-2 tw_flex-wrap">
            <NuxtLink
              v-for="person in video.people.split(',')"
              :key="person"
              class="link"
              :to="`/dashboard?search=person:${person.trim()}`"
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
          <div class="tw_flex tw_gap-x-2 tw_flex-wrap">
            <span class="tw_font-bold">Collection: </span>
            <NuxtLink
              class="link"
              :to="`/dashboard?search=file:${video.video.name.split('.')[0]}.`"
            >
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
