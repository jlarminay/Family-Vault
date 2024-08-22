<script setup lang="ts">
const features = ref([
  {
    title: 'Web App',
    description:
      'Built with Nuxt.js, the web app is a full-stack application that allows users to access a huge collection of photos and videos from any device. The app is designed to be responsive, user-friendly, and highly accessible.',
    image: '/landing/web_app.webp',
    blob: '/landing/blob_1.svg',
  },
  {
    title: 'Photo Gallery',
    description:
      'Running on a Raspberry Pi, the photo gallery is a self-hosted solution that auto pulls images from the server to ensure the latest content is always available. This desk sized device is perfect for displaying photos in your home or office.',
    image: '/landing/photo-album.webp',
    blob: '/landing/blob_2.svg',
  },
  {
    title: 'The Process',
    description:
      'The full process of organizing, scanning, editing, and uploading photos and videos is quite the task. This project is a labor of love and a way to preserve the past for future generations.',
    image: '/landing/all_formats.webp',
    blob: '/landing/blob_3.svg',
    link: '/document',
  },
]);
</script>

<template>
  <section class="tw_text-gray-600 tw_body-font">
    <div class="tw_container tw_px-5 tw_py-24 tw_mx-auto tw_overflow-hidden">
      <!-- Web App -->
      <div
        v-for="(feature, i) in features"
        :key="i"
        class="tw_flex tw_items-center lg:tw_w-4/5 tw_mx-auto tw_pb-14 tw_mb-14 last:tw_mb-0 last:pb-0 sm:tw_flex-row tw_flex-col"
      >
        <div
          class="tw_relative sm:tw_w-80 sm:tw_h-80 tw_h-40 tw_w-60 tw_inline-flex tw_items-center tw_justify-center tw_rounded-full tw_flex-shrink-0"
          :class="`${i % 2 === 0 ? 'sm:tw_mr-10' : 'sm:tw_ml-10 sm:tw_order-last'}`"
        >
          <img
            :src="feature.blob"
            class="tw_absolute tw_opacity-20 tw_stroke-primary"
            :svg-color="i % 2 === 0 ? 'secondary' : 'primary'"
          />
          <img :src="feature.image" class="tw_relative" />
        </div>

        <div class="tw_relative tw_flex-grow sm:tw_text-left tw_text-center tw_mt-6 sm:tw_mt-0">
          <h2 class="h1">{{ feature.title }}</h2>
          <p class="tw_text-lg">
            {{ feature.description }}
          </p>
          <q-btn
            v-if="feature.link"
            no-caps
            unelevated
            label="Learn More"
            color="primary"
            class="tw_mt-4"
            :to="feature.link"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="postcss">
img[svg-color='primary'] {
  filter: invert(27%) sepia(84%) saturate(6733%) hue-rotate(242deg) brightness(88%) contrast(102%);
  animation: blob 120s infinite linear;
}
img[svg-color='secondary'] {
  filter: invert(45%) sepia(79%) saturate(3889%) hue-rotate(329deg) brightness(96%) contrast(102%);
  animation: blob 120s infinite linear reverse;
}
@keyframes blob {
  0% {
    transform: rotate(0deg) scale(1.7);
  }
  100% {
    transform: rotate(360deg) scale(1.7);
  }
}
</style>
