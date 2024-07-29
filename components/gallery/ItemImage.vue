<script setup lang="ts">
const props = defineProps({
  thumbnailPath: {
    type: String,
    required: true,
  },
  metadata: {
    type: Object,
    required: false,
  },
});

const showImage = ref(false);

function onIntersection(entry: IntersectionObserverEntry): boolean {
  if (entry.isIntersecting) {
    startTimer();
  }
  return true;
}
async function startTimer() {
  await new Promise((resolve) => setTimeout(resolve, 250));
  showImage.value = true;
}
</script>

<template>
  <div
    v-intersection.once="onIntersection"
    class="tw_w-full tw_aspect-video tw_rounded tw_overflow-hidden tw_bg-gray-200"
    :style="metadata?.color ? `background-color: ${metadata.color};` : ''"
  >
    <img v-if="showImage" :src="thumbnailPath" class="tw_w-full tw_h-full tw_object-cover" />
    <div v-else class="tw_flex tw_justify-center tw_items-center tw_w-full tw_h-full">
      <q-spinner-dots color="primary" size="40px" />
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
