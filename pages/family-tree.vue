<script setup lang="ts">
import Panzoom from '@panzoom/panzoom';

definePageMeta({
  middleware: 'authorized-only',
});

const settingStore = useSettingStore();
const panzoom = ref<any>(null);
const familyTreeUrl = ref((await settingStore.getAll()).familyTreeUrl);

onMounted(() => {
  const elem = document.getElementById('imageTree');
  if (!elem) return;

  panzoom.value = Panzoom(elem, {
    maxScale: 20,
    contain: 'outside',
  });
  elem.parentElement?.addEventListener('wheel', panzoom.value.zoomWithWheel);
});
</script>

<template>
  <Head>
    <title>Family Tree | Larminay Vault</title>
  </Head>

  <NuxtLayout name="app">
    <main class="tw_p-1 sm:tw_px-6 sm:tw_py-4 tw_max-w-[1000px] tw_mx-auto">
      <h1 class="h1">Family Tree</h1>

      <pre>{{ familyTreeUrl }}</pre>

      <div class="tw_mt-4">
        <div class="tw_border tw_rounded">
          <img id="imageTree" :src="familyTreeUrl" class="tw_w-full tw_p-10" />
        </div>
      </div>
    </main>
  </NuxtLayout>
</template>

<style scoped lang="postcss"></style>
