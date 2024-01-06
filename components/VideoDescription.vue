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
      <p>{{ video.description }}</p>

      <!-- More information -->
      <div v-if="showMore" class="tw_mt-6">
        <div class="tw_flex tw_gap-1">
          <span class="tw_font-bold">Includes: </span>
          <NuxtLink
            v-for="(person, i) in video.persons"
            :key="i"
            class="tw_m-0 tw_rounded-full tw_px-2 tw_bg-secondary tw_text-white tw_text-sm tw_font-bold tw_leading-[24px] tw_cursor-pointer hover:tw_opacity-70 tw_transition-opacity tw_duration-300"
            :href="`/people/${person.id}`"
          >
            {{ person.name }}
          </NuxtLink>
          <span v-if="video.persons.length === 0" class="tw_opacity-70 tw_italic"> None </span>
        </div>
        <div>
          <span class="tw_font-bold">Video Resolution: </span>
          <span>{{ video.video.metadata.resolution }}</span>
        </div>
        <div>
          <span class="tw_font-bold">Video Size: </span>
          <span>{{ formatSize(video.video.size) }}</span>
        </div>
        <div>
          <span class="tw_font-bold">Uploaded By: </span>
          <span>{{ video.owner.name }}</span>
        </div>
        <div>
          <span class="tw_font-bold">Uploaded Date: </span>
          <span>{{ $dayjs(video.createdAt).format('MMMM D, YYYY') }}</span>
        </div>
      </div>
    </div>

    <div class="tw_text-center tw_mt-2">
      <q-btn no-caps unelevated rounded size="14px" color="primary" @click="showMore = !showMore">
        {{ showMore ? 'Show Less' : 'Show More' }}
      </q-btn>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
