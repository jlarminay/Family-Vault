<script setup lang="ts">
const props = defineProps({
  video: {
    type: Object,
    required: true,
  },
});

const cleanedList = computed(() => {
  return [props.video.owner, ...props.video.allowList].map((u: any) => u.name).join(', ');
});
</script>

<template>
  <div
    class="tw_border-2 tw_rounded tw_border-orange-200 tw_bg-orange-50 tw_px-4 tw_py-2 tw_flex tw_justify-start tw_items-center tw_gap-4"
  >
    <q-icon name="lock" class="tw_text-primary tw_text-2xl" />
    <p v-if="video.published === 'private'" class="tw_text-lg tw_leading-tight">
      This video is private. Only you can see it.
    </p>
    <p v-if="video.published === 'allow-few'" class="tw_text-lg tw_leading-tight">
      This video is private and viewable only by: {{ cleanedList }}.
    </p>
  </div>
</template>

<style scoped lang="postcss"></style>
