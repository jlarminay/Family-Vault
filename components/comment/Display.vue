<script setup lang="ts">
import dayjs from 'dayjs';

defineProps({
  comment: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="tw_flex tw_gap-4 tw_items-start tw_mt-6 tw_group">
    <div class="tw_min-w-[40px] tw_h-[40px] tw_border tw_rounded-full tw_overflow-hidden">
      <img :src="comment.user.avatar" class="tw_w-full tw_h-full tw_object-cover" />
    </div>
    <div class="tw_flex-1 tw_w-full" style="word-break: break-word">
      <div class="tw_flex tw_items-center tw_justify-between">
        <div>
          <p class="tw_font-bold tw_mb-0">{{ comment.user.name }}</p>
          <p class="tw_text-sm tw_text-gray-500 tw_leading-none">
            {{ dayjs(comment.createdAt).from(dayjs()) }}
          </p>
        </div>
      </div>

      <p class="tw_mt-1">
        {{ comment.text }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
