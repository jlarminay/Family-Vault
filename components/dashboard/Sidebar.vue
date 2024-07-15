<script setup lang="ts">
import dayjs from 'dayjs';

const props = defineProps<{
  selectedItem: any;
  showInfoData: boolean;
  showCommentData: boolean;
}>();

const loading = ref(false);

const displayInfo = computed(() => {
  const mainFile =
    props.selectedItem.type === 'video' ? props.selectedItem.video : props.selectedItem.image;

  return [
    { icon: 'o_description', label: 'Description', value: props.selectedItem.description || '-' },
    { icon: 'o_people', label: 'People', value: props.selectedItem.people || '-' },
    {
      icon: 'o_aspect_ratio',
      label: 'Resolution',
      value: `${mainFile.metadata?.resolution} (${getAspectRatio(mainFile.metadata?.resolution)})`,
    },
    {
      icon: 'o_sd_card',
      label: 'Size',
      value: formatSize(mainFile.size),
    },
    {
      icon: 'o_folder',
      label: 'Filename',
      value: mainFile.name,
    },
    {
      icon: 'o_today',
      label: 'Added Date',
      value: dayjs(props.selectedItem.createdAt).format('MMMM D, YYYY h:mm A'),
    },
  ];
});
</script>

<template>
  <div
    class="tw_fixed tw_top-0 tw_right-0 tw_h-screen tw_z-[12002] tw_w-0 tw_bg-white tw_transition-[width]"
  >
    <!-- Info Block -->
    <div v-if="selectedItem && showInfoData && !loading" class="tw_p-4">
      <div class="tw_flex tw_flex-col tw_gap-8">
        <div v-for="(info, i) in displayInfo" :key="i" class="tw_flex tw_gap-4 tw_items-start">
          <q-icon size="24px" :name="info.icon" class="tw_mt-1.5" />
          <div class="tw_flex tw_flex-col">
            <p class="tw_text-gray-500 tw_leading-none tw_text-sm">{{ info.label }}</p>
            <p class="tw_text-base">{{ info.value }}</p>
          </div>
        </div>

        <div class="tw_flex tw_gap-4 tw_items-center">
          <div class="tw_w-[24px] tw_aspect-square tw_rounded-full tw_overflow-hidden tw_border">
            <img :src="selectedItem.owner.avatar" class="tw_w-full" />
          </div>
          <div class="tw_flex tw_flex-col">
            <p class="tw_text-gray-500 tw_leading-none tw_text-sm">Added By</p>
            <p class="tw_text-base">{{ selectedItem.owner.name }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Comment Block -->
    <div v-if="selectedItem && showCommentData && !loading" class="tw_p-4">
      <div class="tw_flex tw_flex-col tw_gap-8">
        <Comment :itemId="selectedItem.id" />
      </div>
    </div>

    <!-- Loading -->
    <div v-else class="tw_flex tw_justify-center tw_items-center tw_h-full">
      <q-spinner-dots color="primary" size="40px" />
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
