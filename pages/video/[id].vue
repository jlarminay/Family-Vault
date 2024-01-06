<script setup lang="ts">
definePageMeta({
  middleware: 'authorized-only',
});
const route = useRoute();
const videoStore = useVideoStore();
const likeStore = useLikeStore();
const commentStore = useCommentStore();

const videoId = ref<number>(parseInt(route.params.id as string));
const video = ref(await videoStore.getSingle(videoId.value));
// const randomVideos = ref(await videoStore.getRandom(6, videoId.value));
const randomVideos = ref([]);
// const comments = ref(await commentStore.getForVideo(videoId.value));
const comments = ref([]);
// const likeCount = ref(await likeStore.getVideoCount(videoId.value));
const likeCount = ref(0);
// const currentlyLiked = ref(await likeStore.isVideoLiked(videoId.value));
const currentlyLiked = ref(false);

const showMore = ref<boolean>(false);
const VideoReportModal = ref<boolean>(false);

async function commentPosted() {
  comments.value = await commentStore.getForVideo(videoId.value);
}
async function updateLike() {
  video.value = await videoStore.getSingle(videoId.value);
  console.log(video.value);
  // currentlyLiked.value = await likeStore.update(videoId.value, !currentlyLiked.value);
  // likeCount.value = await likeStore.getVideoCount(videoId.value);
}
</script>

<template>
  <Head>
    <title>{{ video.title || 'Video' }} | Larminay Vault</title>
  </Head>

  <SingleNavMenu />

  <div class="tw_px-6 tw_py-4 tw_max-w-[1400px] tw_mx-auto">
    <div class="tw_flex tw_gap-4">
      <div class="tw_grow">
        <video controls :poster="video.thumbnail.path" class="tw_w-full tw_aspect-video">
          <source :src="video.video.path" type="video/mp4" />
        </video>
        <div class="tw_p-2">
          <div class="tw_flex tw_justify-between tw_items-center">
            <h2 class="h2 tw_font-bold">{{ video.title }}</h2>
            <div class="tw_flex tw_items-center tw_gap-1">
              <q-btn
                rounded
                outline
                :class="{ 'tw_text-red-500': currentlyLiked }"
                @click="updateLike()"
              >
                <q-icon
                  :name="currentlyLiked ? 'o_favorite' : 'o_favorite_border'"
                  :class="{ tada: currentlyLiked }"
                />
                <span class="tw_text-lg tw_ml-2">{{ likeCount }}</span>
              </q-btn>

              <q-btn
                round
                outline
                size="12px"
                icon="sym_o_more_horiz"
                class="tw_cursor-pointer hover:tw_opacity-70 tw_transition-opacity tw_duration-300 tw_ml-2"
              >
                <q-menu :offset="[0, 4]" anchor="bottom right" self="top right">
                  <q-list>
                    <q-item clickable v-close-popup>
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
          <p class="tw_text-gray-500">{{ $dayjs(video.createdAt).format('MMMM D, YYYY') }}</p>

          <div class="tw_mt-4">
            <div :class="{ 'tw_line-clamp-3': !showMore }">
              <!-- Description -->
              <p>{{ video.description }}</p>

              <!-- More information -->
              <div v-if="showMore" class="tw_mt-6">
                <div class="tw_flex tw_gap-1">
                  <span class="tw_font-bold">Includes: </span>
                  <NuxtLink
                    v-for="(person, i) in video.persons"
                    :key="i"
                    class="tw_m-0 tw_rounded-full tw_px-2 tw_bg-secondary tw_text-white tw_text-sm tw_font-bold tw_leading-[24px] tw_cursor-pointer hover:tw_opacity-70 tw_transition-opacity tw_duration-300"
                    :href="`/people/${person.id}`"
                  >
                    {{ person.name }}
                  </NuxtLink>
                  <span v-if="video.persons.length === 0" class="tw_opacity-70 tw_italic">
                    None
                  </span>
                </div>
                <div>
                  <span class="tw_font-bold">Video Resolution: </span>
                  <span>{{ video.video.metadata.resolution }}</span>
                </div>
                <div>
                  <span class="tw_font-bold">Video Size: </span>
                  <span>{{ video.video.size }}</span>
                </div>
                <div>
                  <span class="tw_font-bold">Uploaded By: </span>
                  <span>{{ video.owner.name }}</span>
                </div>
                <div>
                  <span class="tw_font-bold">Uploaded Date: </span>
                  <span>{{ $dayjs(video.createdAt).format('MMMM D, YYYY') }}</span>
                </div>
              </div>
            </div>

            <div class="tw_text-center tw_mt-2">
              <q-btn
                no-caps
                unelevated
                rounded
                size="14px"
                color="primary"
                @click="showMore = !showMore"
              >
                {{ showMore ? 'Show Less' : 'Show More' }}
              </q-btn>
            </div>
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
      <div class="tw_min-w-[250px] tw_w-[250px] tw_px-2">
        <h3 class="h3">Related Videos</h3>

        <RelatedVideoDisplay v-for="(video, i) in randomVideos" :key="i" :video="video" />
      </div>
    </div>
  </div>

  <ReportModal :videoId="videoId" v-model="VideoReportModal" />
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
