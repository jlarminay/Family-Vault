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
  const reader = new FileReader();
  reader.onload = () => {
    uploadFile.value = {
      data: file,
      base64: reader.result,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type,
      error: false,
    };

    // check if valid image
    if (uploadFile.value.size > props.maxSize) {
      error.value = 'File size too large';
      uploadFile.value.error = true;
    }
    emit('fileUpdated', uploadFile.value);
  };
  reader.readAsDataURL(file);
}
</script>

<template>
  <div class="tw_h-[150px]">
    <!-- Display -->
    <div v-if="!!uploadFile.data" class="tw_flex tw_h-full tw_items-center tw_gap-4">
      <div class="tw_h-[150px] tw_w-[150px] tw_rounded-full tw_overflow-hidden tw_border-4">
        <img :src="uploadFile.preview" class="tw_w-full tw_h-full tw_object-cover" />
      </div>
      <div>
        <p class="tw_text-xl tw_truncate">{{ uploadFile.name }}</p>
        <p class="tw_text-lg" :class="{ 'tw_text-red-500': error !== '' }">
          {{ formatSize(uploadFile.size) }} <span v-if="error !== ''">({{ error }})</span>
        </p>
        <p class="link tw_text-red-500 tw_mt-4" @click="clearFile">Remove Image</p>
      </div>
    </div>

    <!-- Input -->
    <label
      v-else
      for="file-upload"
      class="tw_cursor-pointer tw_rounded tw_w-full tw_h-full tw_border-4 tw_border-gray-300 tw_text-gray-600 tw_border-dashed tw_flex tw_justify-center tw_items-center tw_p-4"
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
