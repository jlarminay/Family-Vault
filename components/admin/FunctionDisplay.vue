<script setup lang="ts">
const adminStore = useAdminStore();
const loading = ref(false);

const props = defineProps<{
  buttonLabel: string;
  buttonAction: string;
}>();

async function performS3Check() {
  loading.value = true;
  const response = await adminStore.s3Action(props.buttonAction);
  console.log(response);
  loading.value = false;
}
</script>

<template>
  <div class="tw_w-1/3">
    <div class="tw_m-1 tw_h-full tw_border tw_rounded tw_p-4 tw_flex tw_flex-col">
      <h3 class="h3 tw_mb-4">
        <slot name="title" />
      </h3>

      <slot name="description" />

      <span class="tw_block tw_grow" />

      <div class="tw_flex tw_items-center tw_justify-between tw_mt-6">
        <p class="tw_italic tw_text-dark tw_opacity-70">est. 9m</p>
        <q-btn
          :label="buttonLabel"
          unelevated
          no-caps
          color="primary"
          :loading="loading"
          :disabled="loading"
          @click="performS3Check()"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
