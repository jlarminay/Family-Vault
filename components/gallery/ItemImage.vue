<script setup lang="ts">
const props = defineProps<{
  thumbnailPath: string;
  metadata: { color?: string };
}>();

const image = ref<HTMLImageElement | null>(null);
const showImage = ref(false);
const imageLoaderStore = useImageLoaderStore();

onMounted(async () => {
  await nextTick();
  imageLoaderStore.initObserver();
  if (image.value) {
    imageLoaderStore.observeImage(image.value);
  }
});

watchEffect(() => {
  if (image.value) {
    image.value.onload = () => {
      showImage.value = true;
    };
  }
});
</script>

<template>
  <div
    class="tw_w-full tw_aspect-video tw_rounded tw_overflow-hidden tw_bg-gray-200"
    :style="metadata?.color ? `background-color: ${metadata.color};` : ''"
  >
    <img ref="image" :data-src="thumbnailPath" class="tw_w-full tw_h-full tw_object-cover" />
    <div
      v-if="!showImage"
      class="tw_flex tw_justify-center tw_absolute tw_top-0 tw_left-0 tw_items-center tw_w-full tw_h-full"
    >
      <q-spinner color="primary" size="30px" />
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
