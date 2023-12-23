<script setup lang="ts">
definePageMeta({
  title: 'Video',
});
const route = useRoute();
const videoStore = useVideoStore();
const commentStore = useCommentStore();

const videoId = ref(parseInt(route.params.id?.[0]));
const video = ref(await videoStore.getSingle(videoId.value));
const randomVideos = ref(await videoStore.getRandom(4));
const comments = ref(await commentStore.getForVideo(videoId.value));
const liked = ref(false);
const showMore = ref(false);

async function commentPosted() {
  console.log('comment posted');
  comments.value = await commentStore.getForVideo(videoId.value);
}
</script>

<template>
  <div v-if="!!video">
    <SingleNavMenu />

    <div class="tw_px-6 tw_py-4 tw_max-w-[1400px] tw_mx-auto">
      <div class="tw_flex tw_gap-4">
        <div class="tw_grow">
          <video controls :poster="video.thumbnail" class="tw_w-full tw_aspect-video">
            <source :src="video.url" type="video/mp4" />
          </video>
          <div class="tw_p-2">
            <div class="tw_flex tw_justify-between tw_items-center">
              <h2 class="h2 tw_font-bold">{{ video.title }}</h2>
              <q-icon
                name="sym_o_favorite"
                size="30px"
                class="tw_cursor-pointer hover:tw_opacity-70 tw_transition-opacity tw_duration-300"
                :class="{ 'tw_text-red-500': liked }"
                @click="liked = !liked"
              />
            </div>
            <p class="tw_text-gray-500">{{ $dayjs(video.createdAt).format('MMMM D, YYYY') }}</p>

            <div class="tw_mt-4">
              <div :class="{ 'tw_line-clamp-3': !showMore }">
                <p>{{ video.description }}</p>
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
  </div>
</template>

<style scoped lang="postcss">
video[poster] {
  object-fit: cover;
}
</style>
