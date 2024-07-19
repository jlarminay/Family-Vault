<script setup lang="ts">
const route = useRoute();

const itemStore = useItemStore();
const search = ref<string>('');
const videoData = ref<any>(null);
const uploadState = ref<string>('idle');
const uploadProgress = ref<number>(0);
const maxUploadSize = 10 * 1024 * 1024 * 1024; // 10 GB

watch(
  () => route.query.search,
  (value) => {
    search.value = value as string;
  },
  { immediate: true },
);

async function uploadVideo() {
  if (!videoData.value || !videoData.value?.name || videoData.value?.error) return;

  uploadState.value = 'uploading';

  const xhr = new XMLHttpRequest();
  const formData = new FormData();
  formData.append('video', videoData.value.data);

  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
      uploadProgress.value = (event.loaded / event.total) * 100;
    }
  };

  xhr.onload = () => {
    if (xhr.status === 200) {
      uploadState.value = 'processing';
    } else {
      uploadState.value = 'error';
    }
    uploadProgress.value = 0; // Reset progress bar after upload
  };

  xhr.onerror = () => {
    console.error('Upload failed');
    uploadProgress.value = 0; // Reset progress bar after upload
  };

  xhr.open('POST', '/api/video/upload');
  xhr.send(formData);
}
</script>

<template>
  <Modal
    ref="modal"
    v-model="itemStore.showUploadModal"
    class="tw_w-full"
    :closeButton="false"
    persistent
  >
    <template #title>Upload Video</template>
    <template #body>
      <div class="tw_mb-2">
        <p v-if="uploadState === 'error'" class="tw_text-lg tw_text-red-500 tw_mb-2">
          An error occurred while uploading the video. Please try again.
        </p>
        <p v-if="uploadState === 'idle'" class="tw_text-lg">
          You can select the video to upload here.
        </p>
        <p v-if="uploadState === 'uploading'" class="tw_text-lg">
          Please don't close this window until the upload is complete.
        </p>
        <p v-if="uploadState === 'processing'" class="tw_text-lg">
          The upload is complete and the window can now be safely closed. The video is now being
          processed. This step may take a few minutes.
        </p>
      </div>
      <UploadVideo
        :maxSize="maxUploadSize"
        :formats="['.mp4']"
        :uploadState="uploadState"
        :progress="uploadProgress"
        @fileUpdated="videoData = $event"
      />
    </template>
    <template #actions>
      <q-btn
        v-if="uploadState === 'idle' || uploadState === 'error'"
        outline
        no-caps
        label="Cancel"
        color="dark"
        @click="
          uploadState = 'idle';
          itemStore.showUploadModal = false;
        "
      />
      <q-btn
        v-if="uploadState === 'error'"
        unelevated
        no-caps
        label="Try Again"
        color="primary"
        @click="uploadState = 'idle'"
      />
      <q-btn
        v-if="uploadState === 'idle'"
        unelevated
        no-caps
        :disabled="!videoData?.name || videoData?.error"
        label="Upload Video"
        color="primary"
        @click="uploadVideo"
      />
      <q-btn
        v-if="uploadState === 'processing'"
        outline
        no-caps
        label="Close"
        class="tw_text-base"
        color="dark"
        @click="
          uploadState = 'idle';
          itemStore.showUploadModal = false;
        "
      />
    </template>
  </Modal>
</template>

<style scoped lang="postcss"></style>
