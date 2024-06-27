<script setup lang="ts">
const props = defineProps({
  type: {
    type: String,
    required: true,
  },
});

const warningText = computed(() => {
  switch (props.type) {
    case 'violence':
      return 'This video contains violent content.';
    case 'nudity':
      return 'This video contains nudity.';
    case 'language':
      return 'This video contains strong language.';
    case 'drugs':
      return 'This video contains drug-related content.';
    case 'other':
      return 'This video contains content that may be inappropriate for some users.';
    default:
      return 'This video contains content that may not be suitable for children.';
  }
});
</script>

<template>
  <div
    class="tw_border-2 tw_rounded tw_border-red-200 tw_bg-red-50 tw_px-4 tw_py-2 tw_flex tw_justify-start tw_items-center tw_gap-4 tw_mb-2"
  >
    <q-icon name="o_warning" class="tw_text-red-600 tw_text-2xl" />
    <p class="tw_text-lg tw_leading-tight">
      {{ warningText }}
    </p>
  </div>
</template>

<style scoped lang="postcss"></style>
