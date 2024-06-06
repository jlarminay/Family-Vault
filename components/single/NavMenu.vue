<script setup lang="ts">
const { data: authData } = useAuth();

const videoStore = useVideoStore();
const search = ref('');
const showSearchInput = ref(false);
const showUploadModal = ref(false);
const videoData = ref<any>(null);
const newVideo = ref<any>(null);

function handleSearch() {
  navigateTo(`/dashboard?search=${search.value}`);
}

async function uploadVideo() {
  if (!videoData.value || !videoData.value?.name || videoData.value?.error) return;
  newVideo.value = await videoStore.uploadVideo(videoData.value);
}
async function clearUploadState() {
  videoStore.uploadState.state = 'idle';
  videoStore.uploadState.progress = 0;
  newVideo.value = null;
  showUploadModal.value = false;
}
</script>

<template>
  <nav
    class="tw_py-1 sm:tw_py-2 tw_px-1 sm:tw_px-6 tw_border-b tw_sticky tw_top-0 tw_bg-white tw_z-10"
  >
    <div class="tw_flex tw_justify-between tw_items-center tw_h-[52px]">
      <!-- Logo -->
      <div class="sm:tw_min-w-[250px]">
        <q-btn
          to="/dashboard"
          no-caps
          flat
          size="20px"
          class="tw_group tw_text-black tw_font-montserrat tw_font-bold"
        >
          <img
            src="/logo/logo.svg"
            class="tw_w-7 tw_mr-2 group-hover:tw_rotate-[720deg] tw_transition-transform tw_duration-1000 tw_ease-in-out"
          />
          Larminay Vault
        </q-btn>
      </div>

      <!-- Search Input -->
      <div v-if="$q.screen.gt.sm">
        <q-input
          outlined
          rounded
          dense
          v-model="search"
          placeholder="Search..."
          class="tw_min-w-[350px] tw_pr-0"
          color="primary"
          @keyup.enter="handleSearch()"
        >
          <template v-slot:append>
            <q-btn round dense flat icon="sym_o_search" @click="handleSearch" />
          </template>
        </q-input>
      </div>

      <!-- Right buttons -->
      <div class="tw_flex tw_items-center tw_justify-end tw_gap-4 sm:tw_min-w-[250px]">
        <!-- <pre>{{ $q.screen.name }}</pre> -->

        <q-btn
          v-if="$q.screen.lt.md"
          round
          flat
          class="!tw_p-0"
          icon="sym_o_search"
          color="dark"
          @click="showSearchInput = !showSearchInput"
        />
        <!-- <q-btn
          round
          flat
          class="!tw_p-0"
          icon="sym_o_cloud_upload"
          color="dark"
          @click="showUploadModal = true"
        /> -->

        <!-- <q-btn round flat class="!tw_p-0" icon="sym_o_notifications" color="dark" disabled>
          <q-tooltip>Notifications (Coming Soon)</q-tooltip>
        </q-btn> -->

        <q-btn round flat class="!tw_p-0" color="white">
          <q-avatar size="40px" class="tw_border">
            <img :src="authData?.avatar" />
          </q-avatar>

          <!-- Dropdown Menu -->
          <q-menu class="tw_min-w-[160px]" :offset="[0, 4]">
            <q-list>
              <q-item clickable v-close-popup to="/account">
                <q-item-section avatar>
                  <q-icon name="sym_o_face" />
                </q-item-section>
                <q-item-section>My Profile</q-item-section>
              </q-item>
              <q-item
                v-if="authData?.role === 'admin'"
                clickable
                v-close-popup
                @click="showUploadModal = true"
              >
                <q-item-section avatar>
                  <q-icon name="sym_o_cloud_upload" />
                </q-item-section>
                <q-item-section>Upload Video</q-item-section>
              </q-item>

              <q-separator />
              <q-item clickable v-close-popup to="/people">
                <q-item-section avatar>
                  <q-icon name="sym_o_groups" />
                </q-item-section>
                <q-item-section>All People</q-item-section>
              </q-item>

              <q-separator />
              <q-item clickable v-close-popup to="/legal">
                <q-item-section avatar>
                  <q-icon name="sym_o_policy" />
                </q-item-section>
                <q-item-section>Legal</q-item-section>
              </q-item>
              <q-item v-if="authData?.role === 'admin'" clickable v-close-popup to="/admin">
                <q-item-section avatar>
                  <q-icon name="sym_o_admin_panel_settings" />
                </q-item-section>
                <q-item-section>Admin</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/logout" class="tw_text-red-600">
                <q-item-section avatar>
                  <q-icon name="sym_o_logout" />
                </q-item-section>
                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </div>

    <div
      v-if="showSearchInput"
      class="tw_flex tw_gap-4 tw_justify-between tw_items-center tw_h-[52px]"
    >
      <q-btn
        round
        flat
        class="!tw_p-0"
        icon="sym_o_arrow_back"
        color="dark"
        @click="showSearchInput = !showSearchInput"
      />
      <q-input
        outlined
        rounded
        dense
        v-model="search"
        placeholder="Search..."
        class="tw_w-full tw_pr-0"
        color="primary"
        @keyup.enter="handleSearch"
      >
        <template v-slot:append>
          <q-btn round dense flat icon="sym_o_search" @click="handleSearch" />
        </template>
      </q-input>
    </div>
  </nav>

  <Modal ref="modal" v-model="showUploadModal" class="tw_w-full" :closeButton="false" persistent>
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
        <p v-if="videoStore.uploadState?.state === 'complete'" class="tw_text-lg">
          The upload is now completed. You can safely close this window.
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
        v-if="
          videoStore.uploadState.state === 'processing' ||
          videoStore.uploadState.state === 'complete'
        "
        outline
        no-caps
        label="Close"
        class="tw_text-base"
        color="dark"
        @click="clearUploadState"
      />
      <q-btn
        v-if="videoStore.uploadState.state === 'complete'"
        unelevated
        no-caps
        label="Go To Video"
        class="tw_text-base"
        color="primary"
        @click="clearUploadState"
        :to="`/video/${newVideo?.id}`"
      />
    </template>
  </Modal>
</template>

<style scoped lang="postcss">
:deep(.q-item__section--avatar) {
  @apply tw_min-w-[0px] tw_mr-0 tw_pr-2;
}
:deep(.q-item__section--avatar .q-icon) {
  @apply tw_text-xl;
}
</style>
