<script setup lang="ts">
const props = defineProps({
  itemId: {
    type: Number,
    required: true,
  },
});

const commentStore = useCommentStore();
const comments = ref<any>([]);
const loading = ref(false);

async function refreshData() {
  loading.value = true;
  comments.value = await commentStore.getForVideo(props.itemId);
  loading.value = false;
}
refreshData();
</script>

<template>
  <div class="tw_border-t tw_pt-4">
    <h4 class="h4">{{ comments.length }} Comments</h4>

    <!-- add comment -->
    <CommentNew :videoId="itemId" @commentPosted="refreshData" />

    <!-- view comments -->
    <div v-if="!loading">
      <div v-if="comments.length > 0">
        <CommentDisplay v-for="(comment, i) in comments" :key="i" :comment="comment" />
      </div>
      <div v-else>
        <p class="tw_text-center tw_text-gray-500 tw_mt-4 tw_italic">No comments yet</p>
      </div>
    </div>
    <div v-else class="tw_flex tw_justify-center tw_mt-4">
      <q-spinner-dots color="primary" size="30px" />
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
