<script setup lang="ts">
import panzoom from 'panzoom';

definePageMeta({
  middleware: 'authorized-only',
});

const panzoomInstance = ref<any>(null);

onMounted(() => {
  const imageElement = document.getElementById('svg');
  if (imageElement) {
    panzoomInstance.value = panzoom(imageElement, {
      maxZoom: 15, // Set the maximum zoom level
      minZoom: 0.5, // Set the minimum zoom level
      zoomSpeed: 0.1, // Adjust zoom sensitivity
      // bounds: true,
      // boundsPadding: 0.5,
    });
  }
});

function recenter() {
  if (panzoomInstance.value) {
    panzoomInstance.value.zoomAbs(0, 0, 1);
    panzoomInstance.value.moveTo(0, 0);
  }
}
</script>

<template>
  <Head>
    <title>Family Tree | Larminay Vault</title>
  </Head>

  <NuxtLayout name="app">
    <main>
      <div class="tw_p-1 sm:tw_px-6 sm:tw_py-4 tw_max-w-[1000px] tw_mx-auto">
        <h1 class="h1">Family Tree</h1>

        <div
          class="tw_border-2 tw_rounded tw_border-orange-200 tw_bg-orange-50 tw_px-2 tw_py-1 tw_mt-4"
        >
          <p class="tw_text-lg">
            This is a work-in-progress and may contain errors or inaccuracies. The content is
            intended for entertainment purposes only and should not be relied upon for accuracy or
            completeness.
          </p>
        </div>
      </div>
    </main>

    <div class="tw_mt-4 tw_overflow-hidden tw_border tw_rounded-md tw_relative tw_m-4">
      <div class="tw_p-2 tw_flex tw_gap-2 tw_absolute tw_z-10 tw_bottom-0 tw_right-0">
        <q-btn
          icon="o_crop_free"
          @click="recenter"
          class="tw_aspect-square tw_bg-white tw_text-dark tw_p-0 tw_rounded-md"
        />
      </div>

      <div id="svg">
        <img src="/assets/family-tree-with-images.svg" alt="Family Tree" />
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped lang="postcss"></style>
