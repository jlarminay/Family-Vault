<script setup lang="ts">
definePageMeta({
  middleware: 'authorized-only',
});
const { data: authData } = useAuth();
const route = useRoute();
const videoStore = useVideoStore();
const likeStore = useLikeStore();
const commentStore = useCommentStore();

const videoId = ref<number>(parseInt(route.params.id as string));
const video = ref(await videoStore.getSingle(videoId.value));
const randomVideos = ref(await videoStore.getRandom(6, videoId.value));
const comments = ref(await commentStore.getForVideo(videoId.value));
const likes = ref(await likeStore.getForVideo(videoId.value));

const VideoReportModal = ref<boolean>(false);

async function commentPosted() {
  comments.value = await commentStore.getForVideo(videoId.value);
}
async function updateLike() {
  await likeStore.update(videoId.value, !likes.value.isLiked);
  likes.value = await likeStore.getForVideo(videoId.value);
}
</script>

<template>
  <Head>
    <title>{{ video.title || 'Video' }} | Larminay Vault</title>
  </Head>

  <div>
    <SingleNavMenu />

    <main class="tw_px-6 tw_py-4 tw_max-w-[1400px] tw_mx-auto tw_mb-8">
      <div class="tw_flex tw_gap-4">
        <div class="tw_grow tw_min-w-0">
          <video controls :poster="video.thumbnail.path" class="tw_w-full">
            <source :src="video.video.path" type="video/mp4" />
          </video>
          <div class="tw_p-2">
            <div class="tw_flex tw_gap-4 tw_justify-between tw_items-start">
              <h2 class="h2 tw_font-bold tw_min-w-0 tw_flex-grow tw_break-words">
                <q-icon
                  v-if="!video.published"
                  name="sym_o_lock"
                  class="tw_text-white tw_bg-red-600 tw_text-xl tw_rounded-full tw_p-1"
                />
                {{ video.title }}
              </h2>
              <div class="tw_flex tw_items-center tw_gap-2">
                <q-btn
                  rounded
                  outline
                  class="tw_flex tw_flex-nowrap"
                  :class="{ 'tw_text-red-500': likes.isLiked }"
                  @click="updateLike()"
                >
                  <div class="tw_flex tw_items-center tw_whitespace-nowrap">
                    <q-icon
                      :name="likes.isLiked ? 'o_favorite' : 'o_favorite_border'"
                      :class="{ tada: likes.isLiked }"
                    />
                    <span class="tw_text-lg tw_ml-1">{{ likes.count }}</span>
                  </div>
                </q-btn>

                <q-btn
                  round
                  outline
                  size="12px"
                  icon="sym_o_more_horiz"
                  class="tw_cursor-pointer hover:tw_opacity-70 tw_transition-opacity tw_duration-300"
                >
                  <q-menu :offset="[0, 4]" anchor="bottom right" self="top right">
                    <q-list>
                      <q-item
                        v-if="authData?.id === video.ownerId"
                        clickable
                        v-close-popup
                        :to="`/video/${video.id}/edit`"
                      >
                        <q-item-section>Edit</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup @click="VideoReportModal = true">
                        <q-item-section>Report</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </div>
            <p class="tw_text-gray-500">{{ video.dateDisplay }}</p>

            <VideoDescription :video="video" />

            <div class="tw_mt-8 tw_border-t tw_pt-4">
              <h3 class="h3">{{ comments.length }} Comments</h3>

              <!-- add comment -->
              <CommentNew :videoId="video.id" @commentPosted="commentPosted()" />

              <!-- view comments -->
              <CommentDisplay v-for="(comment, i) in comments" :key="i" :comment="comment" />
            </div>
          </div>
        </div>
        <div class="tw_min-w-[300px] tw_w-[300px] tw_px-2">
          <h3 class="h3">Related Videos</h3>

          <RelatedVideoDisplay v-for="(video, i) in randomVideos" :key="i" :video="video" />
        </div>
      </div>
    </main>

    <ReportModal :videoId="videoId" v-model="VideoReportModal" />
  </div>
</template>

<style scoped lang="postcss">
video[poster] {
  object-fit: cover;
}

.tada {
  animation: tada 1s linear;
}
@keyframes tada {
  from {
    transform: scale3d(1, 1, 1);
  }

  10%,
  20% {
    transform: scale3d(0.8, 0.8, 0.8) rotate3d(0, 0, 1, -10deg);
  }

  30%,
  50%,
  70%,
  90% {
    transform: scale3d(1.2, 1.2, 1.2) rotate3d(0, 0, 1, 10deg);
  }

  40%,
  60%,
  80% {
    transform: scale3d(1.2, 1.2, 1.2) rotate3d(0, 0, 1, -10deg);
  }

  to {
    transform: scale3d(1, 1, 1);
  }
}
</style>
