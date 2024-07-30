<script setup lang="ts">
const props = defineProps<{
  item: {
    id: number;
    name: string;
  } | null;
}>();

const showConfirmation = ref(false);
const generatedUrl = ref('');

watch(
  () => props.item,
  () => {
    if (!props.item) return;
    showConfirmation.value = false;
    generatedUrl.value = `${window.location.origin}/dashboard?search=file:${props.item.name}`;
  },
);

function copyUrl() {
  navigator.clipboard.writeText(generatedUrl.value).then(() => {
    showConfirmation.value = true;
  });
}
</script>

<template>
  <Modal class="tw_w-full" @hide="showConfirmation = false">
    <template #title>Share</template>
    <template #body>
      <p class="tw_text-center tw_mb-4">
        You can share this URL with others to view this file. The user must have access to the
        system to view the file.
      </p>

      <p
        v-if="showConfirmation"
        class="tw_text-center tw_border tw_rounded tw_border-green-300 tw_bg-green-100 tw_px-2 tw_py-1 tw_mb-2"
      >
        Link Copied!
      </p>
      <q-input v-model="generatedUrl" readonly outlined>
        <template #append>
          <q-btn round flat icon="o_content_copy" @click="copyUrl" />
        </template>
      </q-input>
    </template>
  </Modal>
</template>

<style scoped lang="postcss"></style>
