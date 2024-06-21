<script setup lang="ts">
definePageMeta({
  middleware: 'authorized-only',
});
const { data: authData } = useAuth();
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const videoStore = useVideoStore();

const form = ref<any>(null);
const videoId = ref<number>(parseInt(route.params.id as string));
const video = ref(await videoStore.getSingle(videoId.value));
const allUsers = ref(await userStore.getAll());
const videoEdit = ref<any>({});
const loading = ref(false);

const cleanedAllowList = computed(() => {
  return allUsers.value.filter((user: any) => {
    if (!videoEdit.value.allowList) return true;
    if (user.value === authData?.value?.id) return false;
    return !videoEdit.value.allowList.some((p: any) => p.value === user.value);
  });
});

onMounted(() => {
  let newData = JSON.parse(JSON.stringify(video.value));
  // clean data
  newData.allowList = newData.allowList.map((user: any) => {
    return { label: user.name, value: user.id };
  });
  // return
  videoEdit.value = newData;
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

  <NuxtLayout name="app">
    <main class="tw_px-1 sm:tw_px-6 tw_py-4 tw_max-w-[1000px] tw_mx-auto tw_mb-8">
      <div class="min-[800px]:tw_flex tw_gap-4 tw_items-start tw_relative">
        <!-- Video Details -->
        <div
          class="min-[800px]:tw_w-[350px] min-[800px]:tw_min-w-[350px] tw_mb-6 tw_border tw_bg-gray-50 tw_rounded tw_p-4 tw_overflow-hidden min-[800px]:tw_sticky tw_top-[84px]"
        >
          <h2 class="h2 tw_font-bold tw_mb-4">Video Details</h2>
          <video controls :poster="video.thumbnail?.path" class="tw_w-full tw_mb-2">
            <source :src="video.video.path" type="video/mp4" />
          </video>

          <div>
            <span class="tw_font-bold">Duration: </span>
            <span>{{ formatDuration(video?.video?.metadata?.duration) }}</span>
          </div>
          <div>
            <span class="tw_font-bold">Resolution: </span>
            <span>
              {{ video.video.metadata?.resolution }} ({{
                getAspectRatio(video.video.metadata.resolution)
              }})
            </span>
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

        <!-- Edit Video Data -->
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
                maxlength="1024"
                autogrow
                counter
                :rules="[(val: string) => val.length <= 1024 || 'Max 1024 characters']"
              />
              <q-input
                outlined
                no-error-icon
                v-model="videoEdit.people"
                label="Who's in the video?"
                maxlength="1024"
                autogrow
                counter
                :rules="[(val: string) => val.length <= 1024 || 'Max 1024 characters']"
              />
              <q-input
                outlined
                no-error-icon
                v-model="videoEdit.dateDisplay"
                label="Date Taken (Display)"
                maxlength="64"
                counter
                :rules="[(val: string) => val.length <= 64 || 'Max 64 characters']"
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
                  <q-icon name="o_event" class="cursor-pointer">
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
              <q-input
                outlined
                no-error-icon
                v-model="videoEdit.originalFormat"
                label="Original Format"
                maxlength="64"
                counter
                :rules="[(val: string) => val.length <= 64 || 'Max 64 characters']"
              />
              <q-input
                outlined
                no-error-icon
                v-model="videoEdit.tags"
                label="Tags"
                maxlength="1024"
                autogrow
                counter
                :rules="[(val: string) => val.length <= 1024 || 'Max 1024 characters']"
              />
            </div>

            <!-- Security -->
            <div class="tw_mt-6">
              <h3 class="h3 tw_font-bold tw_mb-2">Security</h3>
              <q-select
                behavior="menu"
                outlined
                no-error-icon
                v-model="videoEdit.published"
                label="Publish Status"
                emit-value
                map-options
                :options="[
                  { label: 'Video is private to me', value: 'private' },
                  { label: 'Video is public to everyone', value: 'public' },
                  { label: 'Video is public to only a few', value: 'allow-few' },
                ]"
                required
                :rules="[(val: string) => !!val || 'Required']"
              />
              <q-select
                v-if="videoEdit.published === 'allow-few'"
                behavior="menu"
                outlined
                no-error-icon
                v-model="videoEdit.allowList"
                label="Who can see the video?"
                map-options
                multiple
                use-chips
                hint=""
                :options="cleanedAllowList"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="tw_italic tw_opacity-70 tw_text-base tw_text-center">
                      No options
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <!-- Actions -->
            <div class="tw_flex tw_gap-2 tw_justify-end tw_mt-4">
              <q-btn
                no-caps
                unelevated
                outline
                color="dark"
                label="Cancel"
                :to="`/video/${video.id}`"
              />
              <q-btn
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
  </NuxtLayout>
</template>

<style scoped lang="postcss"></style>
