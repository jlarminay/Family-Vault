<script setup lang="ts">
const route = useRoute();

const videoStore = useVideoStore();
const search = ref<string>('');
const videoData = ref<any>(null);
const newVideo = ref<any>(null);

watch(
  () => route.query.search,
  (value) => {
    search.value = value as string;
  },
  { immediate: true },
);

async function uploadVideo() {
  if (!videoData.value || !videoData.value?.name || videoData.value?.error) return;
  newVideo.value = await videoStore.uploadVideo(videoData.value);
}
async function clearUploadState() {
  videoStore.uploadState.state = 'idle';
  videoStore.uploadState.progress = 0;
  newVideo.value = null;
  videoStore.showUploadModal = false;
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
        <p v-if="videoStore.uploadState?.state === 'idle'" class="tw_text-lg">
          You can select the video to upload here.
        </p>
        <p v-if="videoStore.uploadState?.state === 'uploading'" class="tw_text-lg">
          Please don't close this window until the upload is complete.
        </p>
        <p v-if="videoStore.uploadState?.state === 'processing'" class="tw_text-lg">
          The upload is complete and the window can now be safely closed. The video is now being
          processed. This step may take a few minutes.
        </p>
      </div>
      <UploadVideo
        :maxSize="2 * 1024 * 1024 * 1024"
        :formats="['.mp4']"
        :uploadState="videoStore.uploadState"
        @fileUpdated="videoData = $event"
      />
    </template>
    <template #actions>
      <q-btn
        v-if="videoStore.uploadState.state === 'idle'"
        outline
        no-caps
        label="Cancel"
        color="dark"
        @click="clearUploadState"
      />
      <q-btn
        v-if="videoStore.uploadState.state === 'idle'"
        unelevated
        no-caps
        :disabled="!videoData?.name || videoData?.error"
        label="Upload Video"
        color="primary"
        @click="uploadVideo"
      />
      <q-btn
        v-if="videoStore.uploadState.state === 'processing'"
        outline
        no-caps
        label="Close"
        class="tw_text-base"
        color="dark"
        @click="clearUploadState"
      />
    </template>
  </Modal>
</template>

<style scoped lang="postcss"></style>
