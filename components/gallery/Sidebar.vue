<script setup lang="ts">
import dayjs from 'dayjs';

const { data: authData } = useAuth();
const emits = defineEmits(['edit']);
const props = defineProps<{
  selectedItem: any;
  showInfoData: boolean;
  showCommentData: boolean;
}>();

const loading = ref(false);

const displayInfo = computed(() => {
  return [
    {
      icon: 'o_today',
      label: 'Date Taken',
      value: `${dayjs(props.selectedItem.takenAt).format('MMMM D, YYYY')} ${
        props.selectedItem.dateEstimate ? '(est.)' : ''
      }`,
    },
    { icon: 'o_description', label: 'Description', value: props.selectedItem.description || '-' },
    { icon: 'o_people', label: 'People', value: props.selectedItem.people || '-' },
    {
      icon: 'o_aspect_ratio',
      label: 'Resolution',
      value: `${props.selectedItem.metadata?.resolution} (${getAspectRatio(
        props.selectedItem.metadata?.resolution,
      )})`,
    },
    {
      icon: 'o_sd_card',
      label: 'Size',
      value: formatSize(props.selectedItem.size),
    },
    {
      icon: 'o_folder',
      label: 'Filename',
      value: props.selectedItem.name,
    },
    {
      icon: 'o_today',
      label: 'Added Date',
      value: dayjs(props.selectedItem.createdAt).format('MMMM D, YYYY'),
    },
  ];
});
</script>

<template>
  <div
    class="tw_fixed tw_top-0 tw_right-0 tw_h-screen tw_z-[12003] tw_w-0 tw_bg-white tw_transition-[width] tw_overflow-x-hidden tw_overflow-y-scroll"
  >
    <!-- Info Block -->
    <div v-if="selectedItem && showInfoData && !loading" class="tw_p-4 tw_h-full">
      <div class="tw_flex tw_flex-col tw_gap-6 tw_h-full">
        <GalleryLockWarning :item="selectedItem" />

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

        <q-btn
          v-if="authData?.role === 'admin'"
          unelevated
          no-caps
          label="Edit Info"
          color="primary"
          @click="emits('edit')"
        />
      </div>
    </div>

    <!-- Comment Block -->
    <div v-else-if="selectedItem && showCommentData && !loading" class="tw_p-4">
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
