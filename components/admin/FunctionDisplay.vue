<script setup lang="ts">
const props = defineProps<{
  buttonLabel: string;
  buttonAction: string;
  estimate?: string;
}>();

const adminStore = useAdminStore();
const loading = ref(false);
const currentSeconds = ref(0);

async function performS3Check() {
  loading.value = true;
  currentSeconds.value = 0;

  // Start the timer
  const interval = setInterval(() => {
    currentSeconds.value += 1;
  }, 1000);

  const response = await adminStore.s3Action(props.buttonAction);
  console.log(response);
  loading.value = false;

  // Stop the timer
  clearInterval(interval);
}

function secondsToTime(secondsString: string | undefined) {
  if (!secondsString) return 'n/a';

  const seconds = parseInt(secondsString);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secondsLeft = Math.floor(seconds % 60);

  let finalString = [];
  if (hours > 0) finalString.push(`${hours}h`);
  if (hours > 0 || minutes > 0) finalString.push(`${minutes}m`);
  if (hours > 0 || minutes > 0 || secondsLeft > 0) finalString.push(`${secondsLeft}s`);
  if (finalString.length === 0) return '0s';

  return finalString.join(' ');
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
        <p class="tw_italic tw_text-dark tw_opacity-70">est. {{ secondsToTime(estimate) }}</p>
        <q-btn
          :label="buttonLabel"
          unelevated
          no-caps
          color="primary"
          :disabled="loading"
          :loading="loading"
          @click="performS3Check()"
        >
          <template #loading>{{ secondsToTime(currentSeconds.toString()) }}</template>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
