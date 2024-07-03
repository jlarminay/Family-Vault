<script setup lang="ts">
definePageMeta({
  middleware: 'authorized-only',
});
const { data: authData } = useAuth();
const route = useRoute();

const itemStore = useItemStore();
const likeStore = useLikeStore();
const allItemsCount = ref(0);
const allItems = ref<any>([]);
const allLikes = ref(await likeStore.getAllMine());
const loading = ref(false);
const expandedView = ref(false);

const page = ref(1);
const filters = ref({
  search: '',
  sortBy: 'date-added-desc',
  filterBy: 'all',
});

watch(
  () => [filters.value.sortBy, filters.value.filterBy, route.query.search],
  async (newValue, oldValue) => {
    if (
      !oldValue ||
      newValue[0] !== oldValue[0] ||
      newValue[1] !== oldValue[1] ||
      newValue[2] !== oldValue[2]
    ) {
      // clean filter
      page.value = 1;
      filters.value.search = ((route.query.search as string) || '').toLowerCase();
      // send filter
      allItems.value = [];
      await search();
    }
  },
  { immediate: true },
);

async function search() {
  // scroll to top
  loading.value = true;
  const result = await itemStore.search({
    ...filters.value,
    page: page.value,
  });
  if (result.page === 1) allItems.value = [];
  allItemsCount.value = result.count;
  allItems.value = [...allItems.value, ...result.items];
  loading.value = false;
}
async function loadMore() {
  page.value++;
  loading.value = true;
  await search();
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
            Dashboard <span class="tw_text-lg">({{ allItemsCount }})</span>
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
            <q-btn
              v-if="authData?.hasPrivateVideos"
              round
              flat
              class="!tw_p-0"
              icon="o_lock"
              :color="filters.filterBy === 'private' ? 'primary' : 'dark'"
              :loading="loading"
              @click="filters.filterBy = filters.filterBy === 'private' ? 'all' : 'private'"
            />
          </div>
        </div>

        <div class="tw_flex tw_gap-0 tw_justify-start tw_flex-wrap tw_items-start tw_@container">
          <div
            v-if="allItems.length === 0 && !loading"
            class="tw_text-lg tw_mt-4 tw_text-center tw_italic tw_opacity-70 tw_w-full"
          >
            <span v-if="filters.filterBy === 'liked'">No Liked Items</span>
            <span v-if="filters.filterBy === 'private'">No Private Items</span>
            <span v-else>No Items Found</span>
          </div>
          <DashboardItem
            v-for="(item, i) in allItems"
            :key="i"
            :expandedView="expandedView"
            :item="item"
            :liked="allLikes.some((like: any) => like.itemId === item.id)"
            class="tw_w-1/2 @lg:tw_w-1/3 @xl:tw_w-1/3 @3xl:tw_w-1/4 @5xl:tw_w-1/5 @7xl:tw_w-1/6"
          />
        </div>

        <div v-if="loading" class="tw_flex tw_justify-center">
          <q-spinner-dots color="primary" size="40px" />
        </div>

        <q-infinite-scroll
          @load="loadMore"
          :offset="100"
          :disable="loading || allItems.length >= allItemsCount"
        />
      </main>

      <div></div>
    </template>
  </NuxtLayout>
</template>

<style scoped lang="postcss"></style>
