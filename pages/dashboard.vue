<script setup lang="ts">
definePageMeta({
  middleware: 'authorized-only',
});
const { data: authData } = useAuth();
const route = useRoute();

const videoStore = useVideoStore();
const likeStore = useLikeStore();
const allVideos = await videoStore.getAll();
const allLikes = await likeStore.getAllMine();
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
const filterOptions = ref<any>([
  {
    label: 'Filter: All',
    value: 'all',
  },
  {
    label: 'Filter: Liked Videos',
    value: 'liked',
  },
  {
    label: 'Filter: My Videos',
    value: 'mine',
  },
]);
const filterBy = ref<string>('all');

const cleanedAllVideos = computed(() => {
  let sortedVideos = [...allVideos];

  // filter is searched
  if (route.query?.search) {
    sortedVideos = sortedVideos.filter((video: any) => {
      return video.title.toLowerCase().includes(route.query?.search?.toString().toLowerCase());
    });
  }

  // filter by
  switch (filterBy.value) {
    case 'liked':
      sortedVideos = sortedVideos.filter((video: any) => {
        return allLikes.some((like: any) => like.videoId === video.id);
      });
      break;
    case 'mine':
      sortedVideos = sortedVideos.filter((video: any) => {
        return video.ownerId === authData.value?.id;
      });
      break;
  }

  // sort by
  switch (sortBy.value) {
    case 'title-asc':
      sortedVideos = sortedVideos.sort((a: any, b: any) => {
        return a.title.localeCompare(b.title);
      });
      break;
    case 'title-desc':
      sortedVideos = sortedVideos.sort((a: any, b: any) => {
        return b.title.localeCompare(a.title);
      });
      break;
    case 'date-taken-desc':
      sortedVideos = sortedVideos.sort((a: any, b: any) => {
        return new Date(b.dateOrder).getTime() - new Date(a.dateOrder).getTime();
      });
      break;
    case 'date-taken-asc':
      sortedVideos = sortedVideos.sort((a: any, b: any) => {
        return new Date(a.dateOrder).getTime() - new Date(b.dateOrder).getTime();
      });
      break;
    case 'date-added-desc':
      sortedVideos = sortedVideos.sort((a: any, b: any) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      break;
    case 'date-added-asc':
      sortedVideos = sortedVideos.sort((a: any, b: any) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
      break;
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
        <div class="tw_flex tw_gap-2">
          <q-select
            v-model="filterBy"
            outlined
            no-error-icon
            hide-bottom-space
            dense
            emit-value
            map-options
            :options="filterOptions"
            class="sm:tw_w-[200px]"
          />
          <q-select
            v-model="sortBy"
            outlined
            no-error-icon
            hide-bottom-space
            dense
            emit-value
            map-options
            :options="sortOptions"
            class="sm:tw_w-[230px]"
          />
        </div>
      </div>
      <div class="tw_flex tw_gap-0 tw_justify-start tw_mt-6 tw_flex-wrap tw_items-start">
        <DashboardItem
          v-for="(video, i) in cleanedAllVideos"
          :key="i"
          :video="video"
          :liked="allLikes.some((like: any) => like.videoId === video.id)"
        />
      </div>
    </main>
  </div>
</template>

<style scoped lang="postcss"></style>
