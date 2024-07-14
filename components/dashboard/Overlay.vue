<script setup lang="ts">
import dayjs from 'dayjs';

const route = useRoute();
const router = useRouter();

const itemStore = useItemStore();
const showInfoMenu = ref(true);
const showMoreDetails = ref(false);
const selectedItem = ref<any>(null);
const loading = ref(false);

watch(
  () => route.query.id,
  async (id) => {
    if (id) {
      loading.value = true;
      selectedItem.value = await itemStore.getSingle(id as string);
      loading.value = false;
    }
  },
  { immediate: true },
);

const displayInfo = computed(() => {
  const mainFile =
    selectedItem.value.type === 'video' ? selectedItem.value.video : selectedItem.value.image;
  return [
    { icon: 'o_description', label: 'Description', value: selectedItem.value.description || '-' },
    { icon: 'o_people', label: 'People', value: selectedItem.value.people || '-' },
    {
      icon: 'o_aspect_ratio',
      label: 'Resolution',
      value: `${mainFile.metadata?.resolution} (${getAspectRatio(mainFile.metadata?.resolution)})`,
      hidden: true,
    },
    {
      icon: 'o_sd_card',
      label: 'Size',
      value: formatSize(mainFile.size),
      hidden: true,
    },
    {
      icon: 'o_folder',
      label: 'Filename',
      value: mainFile.name,
      hidden: true,
    },
    {
      icon: 'o_today',
      label: 'Added Date',
      value: dayjs(selectedItem.value.createdAt).format('MMMM D, YYYY h:mm A'),
      hidden: true,
    },
  ];
});
async function closeOverlay() {
  selectedItem.value = null;
  router.push({ path: '/dashboard', query: { ...route.query, id: undefined } });
}
</script>

<template>
  <div
    v-if="selectedItem"
    class="tw_fixed tw_top-0 tw_left-0 tw_w-screen tw_h-screen tw_bg-black tw_bg-opacity-[99%] tw_z-[10000] tw_transition-[top]"
  >
    <div
      class="tw_flex tw_justify-stretch tw_items-stretch tw_h-full tw_w-full"
      :class="{
        'tw_flex-col': $q.screen.lt.sm,
        'tw_flex-row': $q.screen.gt.sm,
      }"
    >
      <!-- Main Container -->
      <div class="tw_flex-grow tw_text-white">
        <div v-if="selectedItem" class="tw_flex tw_flex-col tw_h-full">
          <div class="tw_flex tw_justify-between tw_px-4 tw_py-2">
            <div>
              <q-btn round flat icon="o_arrow_back" @click="closeOverlay" />
            </div>
            <div class="tw_flex tw_gap-2">
              <q-btn round flat icon="o_feedback" />
              <LikeButton :itemId="selectedItem.id" />
              <q-btn round flat icon="o_info" @click="showInfoMenu = !showInfoMenu" />
            </div>
          </div>

          <div class="tw_min-h-0 tw_w-full tw_h-full tw_border-4 tw_border-red-500 tw_p-6">
            <div class="tw_w-full tw_h-full tw_grid tw_grid-cols-1 tw_grid-rows-1">
              <div
                class="tw_col-start-1 tw_row-start-1 tw_w-full tw_h-full tw_flex tw_justify-center tw_items-center"
              >
                <q-spinner-dots color="primary" size="50px" />
              </div>
              <img
                v-if="selectedItem && !loading && selectedItem.type === 'image'"
                :src="selectedItem.image.path"
                class="tw_col-start-1 tw_row-start-1 tw_w-full tw_h-full tw_object-contain"
                draggable="false"
              />
              <div class="tw_col-start-1 tw_row-start-1">
                <VideoPlayer
                  v-if="selectedItem && !loading && selectedItem.type === 'video'"
                  :videoUrl="selectedItem.video.path"
                  :posterUrl="selectedItem.image.path"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Side Menu -->
      <div
        class="tw_flex-shrink tw_h-full tw_bg-white tw_transition-[width,min-width] tw_overflow-x-hidden tw_overflow-y-scroll"
        :class="{
          'tw_min-w-full tw_w-full': $q.screen.lt.sm && showInfoMenu,
          'tw_min-w-[50%] tw_w-[50%]': $q.screen.sm && showInfoMenu,
          'tw_min-w-[400px] tw_w-[400px]': $q.screen.gt.sm && showInfoMenu,
          'tw_min-w-[0px] tw_w-[0px]': !showInfoMenu,
        }"
      >
        <div class="tw_p-4">
          <div v-if="selectedItem && !loading" class="tw_flex tw_flex-col tw_gap-8">
            <div
              v-for="(info, i) in displayInfo"
              :key="i"
              class="tw_flex tw_gap-4 tw_items-start"
              :class="{ tw_hidden: info.hidden && !showMoreDetails }"
            >
              <q-icon size="24px" :name="info.icon" class="tw_mt-1.5" />
              <div class="tw_flex tw_flex-col">
                <p class="tw_text-gray-500 tw_leading-none tw_text-sm">{{ info.label }}</p>
                <p class="tw_text-base">{{ info.value }}</p>
              </div>
            </div>

            <div v-if="showMoreDetails" class="tw_flex tw_gap-4 tw_items-center">
              <div
                class="tw_w-[24px] tw_aspect-square tw_rounded-full tw_overflow-hidden tw_border"
              >
                <img :src="selectedItem.owner.avatar" class="tw_w-full" />
              </div>
              <div class="tw_flex tw_flex-col">
                <p class="tw_text-gray-500 tw_leading-none tw_text-sm">Added By</p>
                <p class="tw_text-base">{{ selectedItem.owner.name }}</p>
              </div>
            </div>

            <div class="tw_flex tw_justify-center">
              <q-btn
                no-caps
                unelevated
                label="Show More Details"
                size="12px"
                color="primary"
                @click="showMoreDetails = !showMoreDetails"
              />
            </div>

            <Comment :itemId="selectedItem.id" />
          </div>
          <div v-else class="tw_flex tw_justify-center tw_items-center tw_h-full">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
