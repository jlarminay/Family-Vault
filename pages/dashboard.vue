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
  type: ['video', 'image'],
  filterBy: 'all',
});

const cleanedAllItems = computed(() => {
  if (!allItems.value) return [];

  // group by date uploaded
  if (filters.value.sortBy === 'date-added-desc') {
    const finalGrouping = [
      { label: 'Today', items: [] as any[] },
      { label: 'Yesterday', items: [] as any[] },
      { label: 'This Week', items: [] as any[] },
      { label: 'This Month', items: [] as any[] },
      { label: 'This Year', items: [] as any[] },
      { label: 'Older', items: [] as any[] },
    ];
    allItems.value.forEach((item: any) => {
      const itemDate = dayjs(item.createdAt);
      const today = dayjs();
      const yesterday = today.subtract(1, 'day');
      const thisWeek = today.subtract(7, 'days');
      const thisMonth = today.subtract(30, 'days');
      const thisYear = today.subtract(365, 'days');

      // if today
      if (itemDate.isSame(today, 'day')) {
        finalGrouping[0].items.push(item);
      }
      // if yesterday
      else if (itemDate.isSame(yesterday, 'day')) {
        finalGrouping[1].items.push(item);
      }
      // if this week
      else if (itemDate.isAfter(thisWeek)) {
        finalGrouping[2].items.push(item);
      }
      // if this month
      else if (itemDate.isAfter(thisMonth)) {
        finalGrouping[3].items.push(item);
      }
      // if this year
      else if (itemDate.isAfter(thisYear)) {
        finalGrouping[4].items.push(item);
      }
      // if older
      else {
        finalGrouping[5].items.push(item);
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
  () => [filters.value.sortBy, filters.value.filterBy, filters.value.type, route.query.search],
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
  refreshLikes();
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

        <div class="tw_flex tw_justify-between sm:tw_justify-start tw_items-center sm:tw_gap-6">
          <h1 class="h1">Dashboard</h1>
          <div class="tw_mr-3">
            <q-btn
              round
              flat
              class="!tw_p-0"
              :icon="!expandedView ? 'o_unfold_more' : 'o_unfold_less'"
              color="dark"
              @click="expandedView = !expandedView"
            />
            <q-btn round flat class="!tw_p-0" icon="o_filter_list" color="dark" :loading="loading">
              <q-menu>
                <div class="tw_flex tw_flex-col sm:tw_flex-row">
                  <!-- Sort By -->
                  <div
                    class="tw_flex tw_flex-col tw_py-2 tw_pl-2 tw_pr-5 tw_border-t sm:tw_border-t-0"
                  >
                    <span class="tw_ml-3 tw_text-gray-500">Sort By</span>
                    <q-radio
                      v-model="filters.sortBy"
                      val="date-added-desc"
                      label="Date Added"
                      v-close-popup
                      class="tw_whitespace-nowrap"
                    />
                    <q-radio
                      v-model="filters.sortBy"
                      val="date-taken-desc"
                      label="Date Taken"
                      v-close-popup
                      class="tw_whitespace-nowrap"
                    />
                  </div>

                  <!-- File Type -->
                  <div
                    class="tw_flex tw_flex-col tw_py-2 tw_pl-2 tw_pr-5 tw_border-t sm:tw_border-t-0"
                  >
                    <span class="tw_ml-3 tw_text-gray-500">File Type</span>
                    <q-checkbox
                      v-model="filters.type"
                      val="video"
                      label="Videos"
                      v-close-popup
                      class="tw_whitespace-nowrap"
                    />
                    <q-checkbox
                      v-model="filters.type"
                      val="image"
                      label="Images"
                      v-close-popup
                      class="tw_whitespace-nowrap"
                    />
                  </div>

                  <!-- Filter Type -->
                  <div
                    class="tw_flex tw_flex-col tw_py-2 tw_pl-2 tw_pr-5 tw_border-t sm:tw_border-t-0"
                  >
                    <span class="tw_ml-3 tw_text-gray-500">Filter By</span>
                    <q-radio
                      v-model="filters.filterBy"
                      val="all"
                      label="All Items"
                      v-close-popup
                      class="tw_whitespace-nowrap"
                    />
                    <q-radio
                      v-model="filters.filterBy"
                      val="liked"
                      label="Liked Items"
                      v-close-popup
                      class="tw_whitespace-nowrap"
                    />
                    <q-radio
                      v-if="authData?.hasPrivateVideos"
                      v-model="filters.filterBy"
                      val="private"
                      label="Private Items"
                      v-close-popup
                      class="tw_whitespace-nowrap"
                    />
                  </div>
                </div>
              </q-menu>
            </q-btn>
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
