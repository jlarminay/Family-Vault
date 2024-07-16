<script setup lang="ts">
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const cleanedList = computed(() => {
  return [props.item.owner, ...props.item.allowList].map((u: any) => u.name).join(', ');
});
</script>

<template>
  <div
    v-if="item.published !== 'public'"
    class="tw_border-2 tw_rounded tw_border-orange-200 tw_bg-orange-50 tw_px-2 tw_py-1 tw_flex tw_justify-start tw_items-start tw_gap-2"
  >
    <p v-if="item.published === 'private'" class="tw_text-bse tw_leading-tight">
      This item is private. Only you can see it.
    </p>
    <p v-if="item.published === 'allow-few'" class="tw_text-bse tw_leading-tight">
      This item is private and viewable only by: <b>{{ cleanedList }}</b
      >.
    </p>
  </div>
</template>

<style scoped lang="postcss"></style>
