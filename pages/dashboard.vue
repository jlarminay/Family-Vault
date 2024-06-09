<script setup lang="ts">
definePageMeta({
  middleware: 'authorized-only',
});
const $q = useQuasar();
const route = useRoute();

const videoStore = useVideoStore();
const likeStore = useLikeStore();
const personStore = usePersonStore();
const collectionStore = useCollectionStore();
const showFilterMenu = ref($q.screen.lt.md ? false : true);
const allVideos = ref<any>([]);
const allLikes = ref(await likeStore.getAllMine());
const allPersons = ref(await personStore.getAll());
const allCollections = ref(await collectionStore.getAll());

const showAllPersons = ref(false);
const showAllCollections = ref(false);
const filters = ref({
  search: '',
  sortBy: 'date-added-desc',
  filterBy: 'all',
  persons: [] as number[],
  collections: [] as number[],
});

watch(
  () => [filters, route.query.search],
  async () => {
    // clean filter
    filters.value.search = ((route.query.search as string) || '').toLowerCase();
    // send filter
    allVideos.value = await videoStore.search(filters.value);
  },
  { deep: true, immediate: true },
);

const cleanedPersons = computed(() => {
  const sorted = allPersons.value.sort((a, b) => {
    if (a.videos !== b.videos) {
      return b.videos - a.videos;
    } else {
      return a.name.localeCompare(b.name);
    }
  });
  return showAllPersons.value ? sorted : sorted.slice(0, 4);
});
const cleanedCollections = computed(() => {
  const sorted = allCollections.value.sort((a, b) => {
    if (a.videos !== b.videos) {
      return b.videos - a.videos;
    } else {
      return a.name.localeCompare(b.name);
    }
  });
  return showAllCollections.value ? sorted : sorted.slice(0, 4);
});

function clearFilters() {
  filters.value = {
    search: '',
    sortBy: 'date-added-desc',
    filterBy: 'all',
    persons: [],
    collections: [],
  };
  navigateTo(`/dashboard`);
}
</script>

<template>
  <Head>
    <title>Dashboard | Larminay Vault</title>
  </Head>

  <NuxtLayout name="app" :showFilterMenu="showFilterMenu" @hideFilterMenu="showFilterMenu = false">
    <template #sidemenu>
      <q-form class="tw_p-4">
        <!-- Filters -->
        <div class="tw_mb-4 tw_pb-4 tw_border-b">
          <h4 class="h4 tw_ml-1">Filter Videos</h4>
          <q-chip
            v-for="(option, i) in [
              {
                label: 'All Videos',
                value: 'all',
              },
              {
                label: 'My Liked Videos',
                value: 'liked',
              },
              {
                label: 'My Uploaded Videos',
                value: 'mine',
              },
            ]"
            :key="i"
            :label="option.label"
            size="12px"
            :class="{
              'tw_bg-primary tw_text-white': filters.filterBy === option.value,
            }"
            clickable
            @click="filters.filterBy = option.value"
          />
        </div>

        <!-- Sort -->
        <div class="tw_mb-4 tw_pb-4 tw_border-b">
          <h4 class="h4 tw_ml-1">Sort Videos</h4>
          <q-chip
            v-for="(option, i) in [
              {
                label: 'Title (A-Z)',
                value: 'title-asc',
              },
              {
                label: 'Title (Z-A)',
                value: 'title-desc',
              },
              {
                label: 'Date Taken (New)',
                value: 'date-taken-desc',
              },
              {
                label: 'Date Taken (Old)',
                value: 'date-taken-asc',
              },
              {
                label: 'Date Added (New)',
                value: 'date-added-desc',
              },
              {
                label: 'Date Added (Old)',
                value: 'date-added-asc',
              },
            ]"
            :key="i"
            :label="option.label"
            size="12px"
            :class="{
              'tw_bg-primary tw_text-white': filters.sortBy === option.value,
            }"
            clickable
            @click="filters.sortBy = option.value"
          />
        </div>

        <!-- Person -->
        <div class="tw_mb-4 tw_pb-4 tw_border-b">
          <div class="tw_flex tw_justify-between tw_items-center">
            <h4 class="h4 tw_ml-1">People</h4>
            <q-btn
              v-if="allPersons.length > 4"
              flat
              dense
              color="primary"
              :label="showAllPersons ? 'Show Less' : 'Show More'"
              size="sm"
              @click="showAllPersons = !showAllPersons"
            />
          </div>
          <q-chip
            v-for="(option, i) in cleanedPersons"
            :key="i"
            size="12px"
            :class="{
              'tw_bg-primary tw_text-white': filters.persons.includes(option.id),
            }"
            clickable
            @click="
              filters.persons = filters.persons.includes(option.id)
                ? filters.persons.filter((id) => id !== option.id)
                : [...filters.persons, option.id]
            "
          >
            <span class="tw_truncate">{{ option.name }}</span>
            <span class="tw_ml-1">({{ option.videos }})</span>
          </q-chip>
        </div>

        <!-- Collection -->
        <div class="tw_mb-4 tw_pb-4 tw_border-b">
          <div class="tw_flex tw_justify-between tw_items-center">
            <h4 class="h4 tw_ml-1">Collections</h4>
            <q-btn
              v-if="allCollections.length > 4"
              flat
              dense
              color="primary"
              :label="showAllCollections ? 'Show Less' : 'Show More'"
              size="sm"
              @click="showAllCollections = !showAllCollections"
            />
          </div>
          <q-chip
            v-for="(option, i) in cleanedCollections"
            :key="i"
            size="12px"
            :class="{
              'tw_bg-primary tw_text-white': filters.collections.includes(option.id),
            }"
            clickable
            @click="
              filters.collections = filters.collections.includes(option.id)
                ? filters.collections.filter((id) => id !== option.id)
                : [...filters.collections, option.id]
            "
          >
            <span class="tw_truncate">{{ option.name }}</span>
            <span class="tw_ml-1">({{ option.videos }})</span>
          </q-chip>
        </div>

        <!-- buttons -->
        <div class="tw_flex tw_justify-end">
          <q-btn outline color="dark" label="Clear Filters" size="sm" @click="clearFilters" />
        </div>
      </q-form>
    </template>

    <template #default>
      <main class="tw_p-1 sm:tw_px-6 sm:tw_py-4 tw_max-w-[1400px] tw_mx-auto">
        <div class="tw_flex tw_justify-start tw_items-center tw_gap-4">
          <h1 class="h1">
            Dashboard <span class="tw_text-lg">({{ allVideos.length }})</span>
          </h1>
          <div>
            <q-btn
              round
              flat
              class="!tw_p-0"
              icon="o_filter_list"
              color="dark"
              @click="showFilterMenu = !showFilterMenu"
            />
          </div>
        </div>
        <div class="tw_flex tw_gap-0 tw_justify-start tw_flex-wrap tw_items-start tw_@container">
          <div
            v-if="allVideos.length === 0"
            class="tw_text-lg tw_mt-4 tw_text-center tw_italic tw_opacity-70 tw_w-full"
          >
            No Videos Found
          </div>
          <DashboardItem
            v-for="(video, i) in allVideos"
            :key="i"
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
