<script setup lang="ts">
definePageMeta({
  middleware: 'authorized-only',
});
const route = useRoute();

const collectionStore = useCollectionStore();
const collection = ref(await collectionStore.getSingle(parseInt(route.params.id)));
</script>

<template>
  <Head>
    <title>Collection | Larminay Vault</title>
  </Head>

  <div>
    <SingleNavMenu />

    <main class="tw_px-6 tw_py-4 tw_max-w-[1400px] tw_mx-auto tw_border">
      <h1 class="h1">{{ collection.name }}</h1>
      <p>{{ collection.description }}</p>
      <h2 class="h2 tw_mt-6">
        Videos <span class="tw_text-lg">({{ collection.videos.length }})</span>
      </h2>
      <div class="tw_flex tw_gap-0 tw_justify-start tw_mt-6 tw_flex-wrap tw_items-start">
        <DashboardItem v-for="(video, i) in collection.videos" :key="i" :video="video" />
      </div>
    </main>
  </div>
</template>

<style scoped lang="postcss"></style>
