<script setup lang="ts">
definePageMeta({
  middleware: 'authorized-only',
});
const route = useRoute();
const router = useRouter();
const videoStore = useVideoStore();

const form = ref<any>(null);
const videoId = ref<number>(parseInt(route.params.id as string));
const video = ref(await videoStore.getSingle(videoId.value));
const videoEdit = ref<any>({});
const loading = ref(false);

onMounted(() => {
  videoEdit.value = JSON.parse(JSON.stringify(video.value));
  videoEdit.value.published = videoEdit.value.published ? 'Yes' : 'No';
});

async function updateVideo() {
  if (!(await form.value.validate())) return;
  //
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
      <div class="tw_flex tw_gap-4 tw_items-start tw_relative">
        <div
          class="tw_w-[350px] tw_border tw_bg-gray-50 tw_rounded tw_p-4 tw_overflow-hidden tw_sticky tw_top-[84px]"
        >
          <h2 class="h2 tw_font-bold tw_mb-4">Video Details</h2>
          <!-- <img :src="video.thumbnail.path" class="tw_w-full tw_my-2 tw_rounded" /> -->
          <video controls :poster="video.thumbnail.path" class="tw_w-full tw_mb-2">
            <source :src="video.video.path" type="video/mp4" />
          </video>

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

          <!-- <pre>{{ video }}</pre> -->
        </div>
        <div class="tw_grow tw_min-w-0 tw_p-4">
          <h2 class="h2 tw_font-bold tw_mb-2">Edit Video Data</h2>

          <q-form ref="form" greedy @submit="updateVideo">
            <!-- Video Content -->
            <div>
              <h3 class="h3 tw_font-bold tw_mb-2">Video Content</h3>
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
              <q-input
                outlined
                no-error-icon
                v-model="videoEdit.dateDisplay"
                label="Date Taken (Display)"
                required
                maxlength="64"
                counter
                :rules="[
                  (val: string) => !!val || 'Required',
                  (val: string) => val.length <= 64 || 'Max 64 characters',
                ]"
              />
              <q-input
                outlined
                no-error-icon
                v-model="videoEdit.dateOrder"
                label="Date Taken (Order)"
                required
                mask="####-##-##"
                :rules="[
                  (val: string) => !!val || 'Required',
                  (val: string) => val.length <= 64 || 'Max 64 characters',
                ]"
              >
                <template v-slot:append>
                  <q-icon name="sym_o_event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="videoEdit.dateOrder" mask="YYYY-MM-DD">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-select
                outlined
                no-error-icon
                v-model="videoEdit.persons"
                label="Video Members"
                :options="[]"
              />
            </div>

            <!-- Security -->
            <div class="tw_mt-6">
              <h3 class="h3 tw_font-bold tw_mb-2">Security</h3>
              <q-select
                outlined
                no-error-icon
                v-model="videoEdit.published"
                label="Publish Status"
                :options="['Video is public', 'Video is private']"
                required
                :rules="[(val: string) => !!val || 'Required']"
              />
            </div>

            <!-- Actions -->
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
