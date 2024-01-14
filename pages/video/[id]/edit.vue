<script setup lang="ts">
definePageMeta({
  middleware: 'authorized-only',
});
const route = useRoute();
const router = useRouter();
const videoStore = useVideoStore();

const videoId = ref<number>(parseInt(route.params.id as string));
const video = ref(await videoStore.getSingle(videoId.value));
const videoEdit = ref<any>({});
const loading = ref(false);

onMounted(() => {
  videoEdit.value = JSON.parse(JSON.stringify(video.value));
});

async function updateVideo() {
  loading.value = true;
  let response = await videoStore.update(videoEdit.value);
  loading.value = false;
  if (!response) {
    toaster({ type: 'error', message: 'Something went wrong.<br/>Please try again later.' });
    return;
  }
  toaster({ type: 'success', message: 'Successfully edited video.' });
  router.push(`/video/${videoId.value}`);
}
</script>

<template>
  <Head>
    <title>{{ video.title || 'Video' }} | Larminay Vault</title>
  </Head>

  <div>
    <SingleNavMenu />

    <main class="tw_px-6 tw_py-4 tw_max-w-[1000px] tw_mx-auto tw_mb-8">
      <div class="tw_flex tw_gap-4 tw_items-start">
        <div
          class="tw_w-[350px] tw_border tw_bg-gray-50 tw_rounded tw_px-4 tw_py-2 tw_overflow-hidden"
        >
          <h2 class="h2 tw_font-bold tw_min-w-0 tw_flex-grow tw_break-words">Video Details</h2>
          <img :src="video.thumbnail.path" class="tw_w-full tw_my-2 tw_rounded" />

          <div>
            <span class="tw_font-bold">Duration: </span>
            <span>{{ formatDuration(video.video.metadata.duration) }}</span>
          </div>
          <div>
            <span class="tw_font-bold">Resolution: </span>
            <span>{{ video.video.metadata.resolution }}</span>
          </div>
          <div>
            <span class="tw_font-bold">Size: </span>
            <span>{{ formatSize(video.video.size) }}</span>
          </div>
          <div>
            <span class="tw_font-bold">Uploaded Date: </span>
            <span>{{ $dayjs(video.createdAt).format('MMMM D, YYYY') }}</span>
          </div>
        </div>
        <div class="tw_grow tw_min-w-0 tw_px-4 tw_py-2">
          <h2 class="h2 tw_font-bold tw_min-w-0 tw_flex-grow tw_break-words">Edit Video Data</h2>

          <q-form ref="form" greedy @submit="updateVideo">
            <q-input
              outlined
              no-error-icon
              v-model="videoEdit.title"
              label="Title"
              required
              maxlength="128"
              counter
              :rules="[
                (val: string) => !!val || 'Required',
                (val: string) => val.length <= 128 || 'Max 128 characters',
              ]"
            />
            <q-input
              outlined
              no-error-icon
              v-model="videoEdit.description"
              label="Description"
              required
              maxlength="1024"
              autogrow
              counter
              :rules="[
                (val: string) => !!val || 'Required',
                (val: string) => val.length <= 1024 || 'Max 1024 characters',
              ]"
            />

            <div class="tw_flex tw_gap-2 tw_justify-end tw_mt-4">
              <q-btn
                rounded
                no-caps
                unelevated
                outline
                color="dark"
                label="Cancel"
                :to="`/video/${video.id}`"
              />
              <q-btn
                rounded
                no-caps
                unelevated
                color="primary"
                label="Save Video"
                :loading="loading"
                @click="updateVideo"
              />
            </div>
          </q-form>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped lang="postcss"></style>
