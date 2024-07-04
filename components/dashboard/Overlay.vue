<script setup lang="ts">
import dayjs from 'dayjs';
const props = defineProps({
  selectedItem: {
    type: Object,
    required: true,
  },
});

const itemStore = useItemStore();
const showInfoMenu = ref(true);
const showMoreDetails = ref(false);

onMounted(async () => {
  // update view count
  await itemStore.incrementViewCount(props.selectedItem.id);
});

const displayInfo = computed(() => {
  if (!props.selectedItem) return [];

  const item = props.selectedItem;
  const mainFile = item.type === 'video' ? item.video : item.image;
  return [
    { icon: 'o_description', label: 'Description', value: item.description || '-' },
    { icon: 'o_people', label: 'People', value: item.people || '-' },
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
      value: dayjs(item.createdAt).format('MMMM D, YYYY h:mm A'),
      hidden: true,
    },
  ];
});
</script>

<template>
  <div
    class="tw_fixed tw_top-0 tw_left-0 tw_w-screen tw_h-screen tw_bg-black tw_bg-opacity-95 tw_z-[10000]"
  >
    <div v-if="selectedItem" class="tw_flex tw_items-stretch tw_h-full">
      <div class="tw_w-full tw_text-white">
        <div class="tw_flex tw_flex-col tw_h-full">
          <div class="tw_flex tw_justify-between tw_px-4 tw_py-2">
            <div>
              <q-btn
                round
                flat
                icon="o_arrow_back"
                :to="{ path: $route.path, query: { ...$route.query, id: undefined } }"
              />
            </div>
            <div class="tw_flex tw_gap-2">
              <q-btn round flat icon="o_feedback" />
              <LikeButton :itemId="selectedItem.id" />
              <q-btn round flat icon="o_info" @click="showInfoMenu = !showInfoMenu" />
            </div>
          </div>

          <div class="tw_min-h-0 tw_p-4 tw_h-full tw_w-full">
            <img
              v-if="selectedItem.type === 'image'"
              :src="selectedItem.file[0].path"
              class="tw_w-full tw_h-full tw_object-contain"
            />
            <VideoPlayer
              v-if="selectedItem.type === 'video'"
              :videoUrl="selectedItem.video.path"
              :posterUrl="selectedItem.image.path"
            />
          </div>
        </div>
      </div>

      <div
        class="tw_h-full tw_bg-white tw_transition-[width] tw_overflow-x-hidden tw_overflow-y-scroll"
        :class="{
          'tw_min-w-1/3 tw_w-1/3': showInfoMenu,
          'tw_w-0': !showInfoMenu,
        }"
      >
        <div class="tw_p-4">
          <div class="tw_flex tw_flex-col tw_gap-8">
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
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
