<script setup lang="ts">
import dayjs from 'dayjs';
const emit = defineEmits(['fileUpdated']);
const props = defineProps({
  maxSize: {
    type: Number,
    required: false,
    default: 1000000,
  },
  formats: {
    type: Array,
    required: true,
  },
  uploadState: {
    type: String,
    required: true,
  },
  progress: {
    type: Number,
    required: true,
  },
});

const timer = ref<any>(null);
const startTime = ref<number>(0);
const elapsedTime = ref<number>(0);
const error = ref<string>('');
const uploadFile = ref<any>({
  data: '',
  preview: '',
  name: '',
  size: '',
  type: '',
  error: false,
});
const cleanedFormats = computed(() => {
  return (
    props.formats
      // @ts-ignore
      .map((format: string) => {
        return format.replace('image/', '.');
      })
      .join(', ')
  );
});

watch(
  () => props.uploadState,
  (newValue, oldValue) => {
    console.log('Upload state changed', oldValue, newValue);
    if (oldValue === 'idle' && newValue === 'uploading') {
      startTime.value = dayjs().unix();
      timer.value = setInterval(() => {
        elapsedTime.value = dayjs().unix() - startTime.value;
      }, 500);
    } else {
      startTime.value = 0;
      clearInterval(timer.value);
    }
  },
  { immediate: true },
);

async function clearFile() {
  // Clear the input field
  const input = document.getElementById('file-upload') as HTMLInputElement;
  if (input) {
    input.value = '';
  }
  uploadFile.value = {
    data: '',
    preview: '',
    name: '',
    size: '',
    type: '',
    error: false,
  };
  emit('fileUpdated', uploadFile.value);
}
async function onFileChange(e: any) {
  error.value = '';
  const file = e.target.files[0];
  uploadFile.value = {
    data: file,
    name: file.name,
    size: file.size,
    type: file.type,
    error: file.size > props.maxSize,
  };
  if (uploadFile.value.error) {
    error.value = 'File size too large';
  }
  emit('fileUpdated', uploadFile.value);
}
function cleanTimeDisplay(time: number): string {
  if (time < 60) return `${Math.floor(time)}s`;
  return `${Math.floor(time / 60)}m ${Math.floor(time % 60)}s`;
}
function estimatedTimeRemaining(): string {
  if (props.progress === 0) {
    return ''; // To handle division by zero
  }
  const est = (elapsedTime.value / props.progress) * (100 - props.progress);
  return cleanTimeDisplay(est);
}
</script>

<template>
  <div>
    <!-- Display -->
    <div v-if="!!uploadFile.name" class="tw_border-4 tw_rounded-lg tw_px-4 tw_py-2">
      <div class="tw_w-full tw_flex tw_items-center tw_justify-between tw_gap-4 tw_z-[1]">
        <div v-if="uploadState === 'processing' || uploadState === 'error'">
          <q-icon
            v-if="uploadState === 'processing'"
            name="o_check_circle"
            size="40px"
            class="tw_text-green-500"
          />
          <q-icon
            v-if="uploadState === 'error'"
            name="o_cancel"
            size="40px"
            class="tw_text-red-500"
          />
        </div>
        <div class="tw_flex-grow tw_min-w-0">
          <p class="tw_text-lg tw_truncate">{{ uploadFile.name }}</p>
          <p class="tw_text-sm" :class="{ 'tw_text-red-500': error !== '' }">
            {{ formatSize(uploadFile.size) }} <span v-if="error !== ''">({{ error }})</span>
          </p>
        </div>
        <q-btn
          v-if="uploadState === 'idle'"
          icon="o_delete"
          round
          flat
          class="tw_text-red-500"
          @click="clearFile"
        />
      </div>
      <div v-if="uploadState === 'uploading'" class="tw_flex tw_justify-center tw_gap-2 tw_mt-2">
        <div class="tw_w-full tw_h-[16px] tw_rounded tw_overflow-hidden tw_border-2">
          <q-skeleton
            class="tw_bg-green-400 tw_rounded-none tw_h-full tw_transition-[width]"
            :style="`width: ${progress}%`"
          />
        </div>
        <p
          class="tw_flex tw_justify-end tw_gap-1 tw_text-sm tw_leading-none tw_text-gray-500 tw_whitespace-nowrap"
        >
          {{ cleanTimeDisplay(elapsedTime) }}
          <span class="tw_px-0.5">•</span>
          {{ Math.floor(progress) }}%
        </p>
      </div>
    </div>

    <!-- Input -->
    <label
      v-else
      for="file-upload"
      class="tw_cursor-pointer tw_rounded tw_w-full tw_h-[150px] tw_border-4 tw_border-gray-300 tw_text-gray-600 tw_border-dashed tw_flex tw_justify-center tw_items-center tw_p-4"
    >
      <div class="tw_text-center">
        <q-icon name="o_upload" size="30px" />
        <span class="tw_font-maven-pro tw_text-xl tw_font-bold">Upload File</span>
        <br />
        <p class="tw_text-sm">Allowed formats: {{ cleanedFormats }}</p>
        <p class="tw_text-sm">Max size: {{ formatSize(maxSize) }}</p>
      </div>
    </label>
    <input
      id="file-upload"
      type="file"
      class="tw_hidden"
      :accept="cleanedFormats"
      @change="onFileChange"
    />
  </div>
</template>

<style scoped lang="postcss"></style>
