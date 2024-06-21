<script setup lang="ts">
definePageMeta({
  middleware: 'authorized-only',
});
const { data: authData } = useAuth();
const route = useRoute();

const videoStore = useVideoStore();
const likeStore = useLikeStore();
const allVideos = ref<any>([]);
const allLikes = ref(await likeStore.getAllMine());
const loading = ref(false);
const expandedView = ref(false);

const filters = ref({
  search: '',
  sortBy: 'date-added-desc',
  filterBy: 'all',
});

watch(
  () => [filters, route.query.search],
  async () => {
    // clean filter
    filters.value.search = ((route.query.search as string) || '').toLowerCase();
    // send filter
    await search();
  },
  { deep: true, immediate: true },
);

async function search() {
  loading.value = true;
  allVideos.value = await videoStore.search(filters.value);
  loading.value = false;
}
</script>

<template>
  <Head>
    <title>Dashboard | Larminay Vault</title>
  </Head>

  <NuxtLayout name="app">
    <template #default>
      <main class="tw_p-1 sm:tw_px-6 sm:tw_py-4 tw_max-w-[1400px] tw_mx-auto">
        <div class="tw_flex tw_justify-between sm:tw_justify-start tw_items-center tw_gap-4">
          <h1 class="h1">
            Dashboard <span class="tw_text-lg">({{ allVideos.length }})</span>
          </h1>
          <div class="tw_mr-3">
            <q-btn
              v-if="authData?.role === 'admin'"
              round
              flat
              class="!tw_p-0"
              icon="o_expand"
              color="dark"
              @click="expandedView = !expandedView"
            />
            <q-btn round flat class="!tw_p-0" icon="o_filter_list" color="dark" :loading="loading">
              <q-menu>
                <q-list>
                  <q-item-label header dense>Sort Videos</q-item-label>
                  <q-item
                    v-for="option in [
                      // { label: 'Alphabetical (A-Z)', value: 'title-asc' },
                      // { label: 'Alphabetical (Z-A)', value: 'title-desc' },
                      { label: 'Date Added (Newest)', value: 'date-added-desc' },
                      { label: 'Date Added (Oldest)', value: 'date-added-asc' },
                      { label: 'Date Taken (Newest)', value: 'date-taken-desc' },
                      { label: 'Date Taken (Oldest)', value: 'date-taken-asc' },
                      { label: 'Duration (Longest)', value: 'duration-desc' },
                      { label: 'Duration (Shortest)', value: 'duration-asc' },
                    ]"
                    :key="option.value"
                    dense
                    clickable
                    v-ripple
                    v-close-popup
                    :active="filters.sortBy === option.value"
                    @click="filters.sortBy = option.value"
                  >
                    <q-item-section>{{ option.label }}</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
            <q-btn
              round
              flat
              class="!tw_p-0"
              icon="o_favorite_border"
              :color="filters.filterBy === 'liked' ? 'primary' : 'dark'"
              :loading="loading"
              @click="filters.filterBy = filters.filterBy === 'liked' ? 'all' : 'liked'"
            />
          </div>
        </div>
        <div class="tw_flex tw_gap-0 tw_justify-start tw_flex-wrap tw_items-start tw_@container">
          <div
            v-if="allVideos.length === 0"
            class="tw_text-lg tw_mt-4 tw_text-center tw_italic tw_opacity-70 tw_w-full"
          >
            <span v-if="filters.filterBy === 'all'">No Videos Found</span>
            <span v-else>No Liked Videos</span>
          </div>
          <DashboardItem
            v-for="(video, i) in allVideos"
            :key="i"
            :expandedView="expandedView"
            :video="video"
            :liked="allLikes.some((like: any) => like.videoId === video.id)"
            class="tw_w-full @lg:tw_w-1/2 @xl:tw_w-1/2 @3xl:tw_w-1/3 @5xl:tw_w-1/4 @7xl:tw_w-1/5"
          />
        </div>
      </main>
    </template>
  </NuxtLayout>
</template>

<style scoped lang="postcss"></style>
