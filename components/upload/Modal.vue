<script setup lang="ts">
const route = useRoute();

const videoStore = useVideoStore();
const search = ref<string>('');
const videoData = ref<any>(null);

watch(
  () => route.query.search,
  (value) => {
    search.value = value as string;
  },
  { immediate: true },
);

async function uploadVideo() {
  if (!videoData.value || !videoData.value?.name || videoData.value?.error) return;

  videoStore.uploadState = 'uploading';

  const xhr = new XMLHttpRequest();
  const formData = new FormData();
  formData.append('video', videoData.value.data);

  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
      videoStore.uploadProgress = (event.loaded / event.total) * 100;
    }
  };

  xhr.onload = () => {
    if (xhr.status === 200) {
      videoStore.uploadState = 'processing';
    } else {
      videoStore.uploadState = 'error';
    }
    videoStore.uploadProgress = 0; // Reset progress bar after upload
  };

  xhr.onerror = () => {
    console.error('Upload failed');
    videoStore.uploadProgress = 0; // Reset progress bar after upload
  };

  xhr.open('POST', '/api/upload');
  xhr.send(formData);
}
</script>

<template>
  <Modal
    ref="modal"
    v-model="videoStore.showUploadModal"
    class="tw_w-full"
    :closeButton="false"
    persistent
  >
    <template #title>Upload Video</template>
    <template #body>
      <div class="tw_mb-2">
        <p v-if="videoStore.uploadState === 'error'" class="tw_text-lg tw_text-red-500 tw_mb-2">
          An error occurred while uploading the video. Please try again.
        </p>
        <p v-if="videoStore.uploadState === 'idle'" class="tw_text-lg">
          You can select the video to upload here.
        </p>
        <p v-if="videoStore.uploadState === 'uploading'" class="tw_text-lg">
          Please don't close this window until the upload is complete.
        </p>
        <p v-if="videoStore.uploadState === 'processing'" class="tw_text-lg">
          The upload is complete and the window can now be safely closed. The video is now being
          processed. This step may take a few minutes.
        </p>
      </div>
      <UploadVideo
        :maxSize="4 * 1024 * 1024 * 1024"
        :formats="['.mp4']"
        :uploadState="videoStore.uploadState"
        :progress="videoStore.uploadProgress"
        @fileUpdated="videoData = $event"
      />
    </template>
    <template #actions>
      <q-btn
        v-if="videoStore.uploadState === 'idle' || videoStore.uploadState === 'error'"
        outline
        no-caps
        label="Cancel"
        color="dark"
        @click="
          videoStore.uploadState = 'idle';
          videoStore.showUploadModal = false;
        "
      />
      <q-btn
        v-if="videoStore.uploadState === 'error'"
        unelevated
        no-caps
        label="Try Again"
        color="primary"
        @click="videoStore.uploadState = 'idle'"
      />
      <q-btn
        v-if="videoStore.uploadState === 'idle'"
        unelevated
        no-caps
        :disabled="!videoData?.name || videoData?.error"
        label="Upload Video"
        color="primary"
        @click="uploadVideo"
      />
      <q-btn
        v-if="videoStore.uploadState === 'processing'"
        outline
        no-caps
        label="Close"
        class="tw_text-base"
        color="dark"
        @click="
          videoStore.uploadState = 'idle';
          videoStore.showUploadModal = false;
        "
      />
    </template>
  </Modal>
</template>

<style scoped lang="postcss"></style>
