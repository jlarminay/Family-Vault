<script setup lang="ts">
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
    type: Object,
    required: true,
  },
});

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
</script>

<template>
  <div>
    <!-- Display -->
    <div v-if="!!uploadFile.name" class="tw_border-4 tw_rounded-lg tw_px-4 tw_py-2">
      <div class="tw_w-full tw_flex tw_items-center tw_justify-between tw_gap-4 tw_z-[1]">
        <div class="tw_flex-grow tw_min-w-0">
          <p class="tw_text-lg tw_truncate">{{ uploadFile.name }}</p>
          <p class="tw_text-sm" :class="{ 'tw_text-red-500': error !== '' }">
            {{ formatSize(uploadFile.size) }} <span v-if="error !== ''">({{ error }})</span>
          </p>
        </div>
        <q-btn
          v-if="uploadState.state === 'idle'"
          icon="sym_o_delete"
          round
          flat
          class="tw_text-red-500"
          @click="clearFile"
        />
      </div>
      <div
        v-if="uploadState.state === 'uploading'"
        class="tw_mt-2 tw_w-full tw_h-[16px] tw_border tw_rounded tw_overflow-hidden"
      >
        <q-skeleton
          class="tw_bg-green-400 tw_rounded-none tw_h-full tw_transition-[width]"
          :style="`width: ${uploadState.progress}%`"
        />
      </div>
    </div>

    <!-- Input -->
    <label
      v-else
      for="file-upload"
      class="tw_cursor-pointer tw_rounded tw_w-full tw_h-[150px] tw_border-4 tw_border-gray-300 tw_text-gray-600 tw_border-dashed tw_flex tw_justify-center tw_items-center tw_p-4"
    >
      <div class="tw_text-center">
        <q-icon name="sym_o_upload" size="30px" />
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
