<script setup lang="ts">
import dayjs from 'dayjs';

const emits = defineEmits(['edit']);
const props = defineProps<{
  selectedItem: any;
  showInfoData: boolean;
  showCommentData: boolean;
}>();
</script>

<template>
  <div
    class="tw_fixed tw_top-0 tw_right-0 tw_h-screen tw_z-[12003] tw_w-0 tw_bg-white tw_transition-[width] tw_overflow-x-hidden tw_overflow-y-scroll"
  >
    <!-- Info Block -->
    <div v-if="selectedItem && showInfoData" class="tw_p-4 tw_h-full">
      <GalleryItemDetails :itemId="selectedItem.id" />
    </div>

    <!-- Comment Block -->
    <div v-else-if="selectedItem && showCommentData" class="tw_p-4">
      <div class="tw_flex tw_flex-col tw_gap-8">
        <Comment :itemId="selectedItem.id" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
