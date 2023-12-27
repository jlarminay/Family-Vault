<script setup lang="ts">
const modal = ref<any>(false);
defineExpose({
  hide: () => modal.value.hide(),
});
</script>

<template>
  <q-dialog ref="modal">
    <q-card class="tw_w-full">
      <q-card-section class="tw_border-b tw_flex tw_justify-between tw_items-center">
        <div class="text-h6"><slot name="title" /></div>
        <q-btn flat round icon="sym_o_close" size="12px" v-close-popup />
      </q-card-section>

      <q-card-section class="tw_p-4 tw_text-base">
        <slot name="body" />
      </q-card-section>

      <q-card-actions align="right" class="tw_p-4">
        <slot name="actions" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped lang="postcss"></style>
