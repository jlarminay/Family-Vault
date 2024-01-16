<script setup lang="ts">
const route = useRoute();
definePageMeta({
  middleware: 'authorized-only',
});

const videoStore = useVideoStore();
const allVideos = await videoStore.getAllPublic();
const sortOptions = ref<any>([
  {
    label: 'Sort: Title (A-Z)',
    value: 'title-asc',
  },
  {
    label: 'Sort: Title (Z-A)',
    value: 'title-desc',
  },
  {
    label: 'Sort: Date Taken (Newest)',
    value: 'date-taken-desc',
  },
  {
    label: 'Sort: Date Taken (Oldest)',
    value: 'date-taken-asc',
  },
  {
    label: 'Sort: Date Added (Newest)',
    value: 'date-added-desc',
  },
  {
    label: 'Sort: Date Added (Oldest)',
    value: 'date-added-asc',
  },
]);
const sortBy = ref<string>('date-added-desc');

const cleanedAllVideos = computed(() => {
  let sortedVideos = [...allVideos];

  // filter is searched
  if (route.query?.search) {
    sortedVideos = sortedVideos.filter((video: any) => {
      return video.title.toLowerCase().includes(route.query?.search?.toString().toLowerCase());
    });
  }

  // sort by
  if (sortBy.value === 'title-asc') {
    sortedVideos = sortedVideos.sort((a: any, b: any) => {
      return a.title.localeCompare(b.title);
    });
  } else if (sortBy.value === 'title-desc') {
    sortedVideos = sortedVideos.sort((a: any, b: any) => {
      return b.title.localeCompare(a.title);
    });
  } else if (sortBy.value === 'date-taken-desc') {
    sortedVideos = sortedVideos.sort((a: any, b: any) => {
      return new Date(b.dateOrder).getTime() - new Date(a.dateOrder).getTime();
    });
  } else if (sortBy.value === 'date-taken-asc') {
    sortedVideos = sortedVideos.sort((a: any, b: any) => {
      return new Date(a.dateOrder).getTime() - new Date(b.dateOrder).getTime();
    });
  } else if (sortBy.value === 'date-added-desc') {
    sortedVideos = sortedVideos.sort((a: any, b: any) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  } else if (sortBy.value === 'date-added-asc') {
    sortedVideos = sortedVideos.sort((a: any, b: any) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }

  return sortedVideos;
});
</script>

<template>
  <Head>
    <title>Dashboard | Larminay Vault</title>
  </Head>

  <div>
    <SingleNavMenu />

    <main class="tw_px-6 tw_py-4 tw_max-w-[1400px] tw_mx-auto">
      <div class="tw_flex tw_justify-between tw_items-center">
        <h1 class="h1">
          Dashboard <span class="tw_text-lg">({{ cleanedAllVideos.length }})</span>
        </h1>
        <q-select
          v-model="sortBy"
          outlined
          no-error-icon
          hide-bottom-space
          rounded
          dense
          emit-value
          map-options
          :options="sortOptions"
          class="tw_rounded-full tw_w-[230px]"
        />
      </div>
      <div class="tw_flex tw_gap-0 tw_justify-start tw_mt-6 tw_flex-wrap tw_items-start">
        <DashboardItem v-for="(video, i) in cleanedAllVideos" :key="i" :video="video" />
      </div>
    </main>
  </div>
</template>

<style scoped lang="postcss"></style>
