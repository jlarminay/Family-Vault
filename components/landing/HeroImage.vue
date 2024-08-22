<script setup lang="ts">
import gsap from 'gsap';

const interval = ref<any>(null);
const images = ref([
  'mireille_005.10.webp',
  'cindi_090.04.webp',
  'cindi_017.05.webp',
  'cindi_090.23.webp',
  'cindi_089.15.webp',
  'cindi_089.04.webp',
]);
const rotations = ref([1, 5, -1, 6, -4, 2]);
const activeImage = ref(0);

function nextImage() {
  const currentIndex = activeImage.value;
  const nextIndex = (currentIndex + 1) % images.value.length;

  const currentImage = document.querySelectorAll('.image-wrapper')[currentIndex];

  gsap.to(currentImage, {
    y: -200, // Move the image up
    x: 100,
    rotate: rotations.value[currentIndex] + 10,
    duration: 0.5,
    onComplete() {
      activeImage.value = nextIndex;
      nextTick(() => {
        gsap.set(currentImage, {
          y: 0,
          x: 0,
          rotate: rotations.value[currentIndex],
          zIndex: 0,
        });
      });
    },
  });
}

onMounted(() => {
  // shuffle images
  images.value = images.value.sort(() => Math.random() - 0.5);
  interval.value = setInterval(nextImage, 5000);
});
onBeforeUnmount(() => {
  clearInterval(interval.value);
});
</script>

<template>
  <div class="tw_relative">
    <div
      v-for="(image, i) in images"
      :key="i"
      class="image-wrapper tw_absolute tw_border-2 tw_bg-gray-200 tw_border-gray-200 tw_rounded-lg tw_overflow-hidden tw_shadow-md"
      :style="`
      z-index: ${i < activeImage ? activeImage - i - 1 : images.length - i + activeImage};
      transform:rotate(${rotations[i]}deg);
      `"
    >
      <div class="tw_aspect-[3/2] tw_border-[12px] tw_border-white tw_overflow-hidden">
        <img :src="`landing/${image}`" class="tw_object-cover" />
      </div>
    </div>

    <!-- default -->
    <div
      class="tw_z-[0] tw_border tw_border-gray-200 tw_rounded-lg tw_overflow-hidden tw_opacity-0"
    >
      <div
        class="tw_aspect-video tw_border-[12px] tw_border-white tw_overflow-hidden tw_bg-primary"
      />
    </div>
  </div>
</template>

<style scoped lang="postcss">
.image-wrapper {
  transition: transform 0.5s ease;
}
</style>
