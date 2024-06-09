<script setup lang="ts">
const emits = defineEmits(['clicked']);
defineProps({
  count: {
    type: Number,
    required: true,
  },
  isLiked: {
    type: Boolean,
    default: false,
  },
});

const isClicked = ref(false);
</script>

<template>
  <q-btn
    outline
    rounded
    :size="$q.screen.lt.sm ? '10px' : '12px'"
    class="tw_flex tw_flex-nowrap"
    :class="{ 'tw_text-red-500': isLiked }"
    @click="
      isClicked = !isLiked;
      emits('clicked');
    "
  >
    <div class="tw_flex tw_items-center tw_whitespace-nowrap">
      <q-icon :name="isLiked ? 'o_favorite' : 'o_favorite_border'" :class="{ tada: isClicked }" />
      <span class="tw_text-sm sm:tw_text-lg tw_ml-1">{{ count }}</span>
    </div>
  </q-btn>
</template>

<style scoped lang="postcss"></style>
