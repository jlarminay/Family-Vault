<script setup lang="ts">
import dayjs from 'dayjs';

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

const cleanedAllItems = computed(() => {
  if (!allItems.value) return [];

  // group by date uploaded
  if (filters.value.sortBy === 'date-added-desc') {
    const finalGrouping = [
      { label: 'Today', items: [] as any[] },
      { label: 'Yesterday', items: [] as any[] },
      { label: 'This Month', items: [] as any[] },
      { label: 'This Year', items: [] as any[] },
      { label: 'Older', items: [] as any[] },
    ];
    allItems.value.forEach((item: any) => {
      const itemDate = dayjs(item.createdAt);
      const today = dayjs();
      const yesterday = today.subtract(1, 'day');
      const thisMonth = today.subtract(30, 'days');
      const thisYear = today.subtract(365, 'days');

      if (itemDate.isSame(today, 'day')) {
        finalGrouping[0].items.push(item);
      } else if (itemDate.isSame(yesterday, 'day')) {
        finalGrouping[1].items.push(item);
      } else if (itemDate.isAfter(thisMonth)) {
        finalGrouping[2].items.push(item);
      } else if (itemDate.isAfter(thisYear)) {
        finalGrouping[3].items.push(item);
      } else {
        finalGrouping[4].items.push(item);
      }
    });

    // remove empty ones
    return finalGrouping
      .filter((group) => group.items.length > 0)
      .map((group, i) => {
        if (i === 0) group.label = `Uploaded ${group.label}`;
        return group;
      });
  }

  // group by date taken
  if (filters.value.sortBy === 'date-taken-desc') {
    const finalGrouping = [] as any;

    // group by month year
    // array must be { label: 'Month Year', items: [] }
    allItems.value.forEach((item: any) => {
      const itemDate = dayjs(item.takenAt);
      const monthYear = itemDate.format('MMMM YYYY');
      const groupIndex = finalGrouping.findIndex((group: any) => group.label === monthYear);
      if (groupIndex === -1) {
        finalGrouping.push({ label: monthYear, items: [item] });
      } else {
        finalGrouping[groupIndex].items.push(item);
      }
    });

    // sort by month year
    finalGrouping.sort((a: any, b: any) => {
      const month1 = dayjs(a.label, 'MMMM YYYY');
      const month2 = dayjs(b.label, 'MMMM YYYY');
      return month2.diff(month1);
    });

    return finalGrouping;
  }

  return [];
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
  allLikes.value = await likeStore.getAllMine();
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
  if (loading.value) return;
  if (allItems.value.length >= allItemsCount.value) return;

  page.value++;
  loading.value = true;
  await search();
}
async function refreshLikes() {
  allLikes.value = await likeStore.getAllMine();
}
</script>

<template>
  <Head>
    <title>Dashboard | Larminay Vault</title>
  </Head>

  <NuxtLayout name="app">
    <template #default>
      <main class="tw_p-1 sm:tw_px-6 sm:tw_py-4 tw_max-w-[1400px] tw_mx-auto">
        <div
          class="tw_border-2 tw_rounded tw_border-blue-200 tw_bg-blue-50 tw_px-2 tw_py-1 tw_mb-4 tw_text-base tw_text-center"
        >
          The system is under maintenance. Some features may not work as expected.
          <br />
          We apologize for the inconvenience.
        </div>

        <div class="tw_flex tw_justify-between sm:tw_justify-start tw_items-center sm:tw_gap-4">
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
                  <q-item
                    v-for="option in [
                      { label: 'Date Added (Newest)', value: 'date-added-desc' },
                      { label: 'Date Taken (Newest)', value: 'date-taken-desc' },
                    ]"
                    :key="option.value"
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

        <Gallery
          :allItems="cleanedAllItems"
          :allLikes="allLikes"
          :loading="loading"
          :expandedView="expandedView"
          @loadMore="loadMore"
          @updateLike="refreshLikes"
        />

        <div v-if="loading" class="tw_flex tw_justify-center">
          <q-spinner-dots color="primary" size="40px" />
        </div>

        <q-infinite-scroll
          @load="loadMore"
          :offset="100"
          :disable="loading || allItems.length >= allItemsCount"
        />
      </main>
    </template>
  </NuxtLayout>
</template>

<style scoped lang="postcss"></style>
