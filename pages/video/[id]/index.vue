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
async function incrementViewCount() {
  await videoStore.incrementViewCount(videoId.value);
}
</script>

<template>
  <Head>
    <title>{{ video.title || 'Video' }} | Larminay Vault</title>
  </Head>

  <NuxtLayout name="app">
    <main class="sm:tw_px-6 sm:tw_py-4 tw_max-w-[1400px] tw_mx-auto tw_mb-8">
      <div class="tw_flex tw_gap-4">
        <div class="tw_grow tw_min-w-0">
          <div
            class="tw_sticky tw_top-[61px] sm:tw_top-0 sm:tw_relative tw_w-full tw_z-50 tw_max-h-[40vh] sm:tw_max-h-[50vh]"
            :style="`aspect-ratio: ${getAspectRatio(video.video?.metadata?.resolution)}`"
          >
            <VideoPlayer
              :videoUrl="video.video?.path || ''"
              :posterUrl="video.thumbnail?.path || ''"
              @initialPlay="incrementViewCount"
            />
          </div>

          <!-- description -->
          <div class="tw_p-2">
            <VideoContentWarning v-if="false" :type="''" />

            <div class="tw_flex tw_gap-4 tw_justify-between tw_items-start">
              <h2 class="h2 tw_font-bold tw_min-w-0 tw_flex-grow tw_break-words">
                {{ video.title }}
              </h2>
              <div class="tw_flex tw_items-center tw_gap-2">
                <LikeButton :count="likes.count" :isLiked="likes.isLiked" @clicked="updateLike" />

                <q-btn
                  round
                  outline
                  :size="$q.screen.lt.sm ? '10px' : '12px'"
                  icon="o_more_horiz"
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
            <p class="tw_text-gray-500">
              {{ video.dateDisplay }}
              <!-- • {{ formatViews(video.views, 'lg') }} views -->
            </p>

            <VideoDescription :video="video" />

            <div v-if="$q.screen.lt.md" class="tw_mt-8 tw_border-t tw_pt-4">
              <VideoRelated :videoId="videoId" type="hor" />
            </div>

            <div class="tw_mt-8 tw_border-t tw_pt-4">
              <h3 class="h3">{{ comments.length }} Comments</h3>

              <!-- add comment -->
              <CommentNew :videoId="video.id" @commentPosted="commentPosted()" />

              <!-- view comments -->
              <CommentDisplay v-for="(comment, i) in comments" :key="i" :comment="comment" />
            </div>
          </div>
        </div>

        <!-- other videos (md) -->
        <div v-if="$q.screen.gt.sm" class="tw_min-w-[350px] tw_w-[350px] tw_px-2">
          <VideoRelated :videoId="videoId" type="ver" />
        </div>
      </div>
    </main>

    <ReportModal :videoId="videoId" v-model="VideoReportModal" />
  </NuxtLayout>
</template>

<style scoped lang="postcss"></style>
