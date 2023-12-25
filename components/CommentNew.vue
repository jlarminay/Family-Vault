<script setup lang="ts">
const { signOut, data } = useAuth();
const commentStore = useCommentStore();

const emit = defineEmits(['commentPosted']);
const props = defineProps({
  videoId: {
    type: Number,
    required: true,
  },
});

const newComment = ref('');
const loading = ref(false);

async function postComment() {
  loading.value = true;
  const cleanedComment = newComment.value.replace(/\n+/g, '\n');
  await commentStore.create(props.videoId, data.value?.id, cleanedComment);
  newComment.value = '';
  loading.value = false;
  emit('commentPosted');
}
</script>

<template>
  <div class="tw_flex tw_gap-4 tw_items-start tw_mt-6 tw_group">
    <div class="tw_w-[40px] tw_h-[40px] tw_bg-gray-200 tw_rounded-full tw_overflow-hidden">
      <img :src="data?.avatar" class="tw_w-full tw_h-full tw_object-cover" />
    </div>
    <div class="tw_flex-1">
      <q-input
        v-model="newComment"
        outlined
        dense
        autogrow
        maxlength="256"
        placeholder="Add a comment..."
      />
      <div v-if="newComment !== ''" class="tw_flex tw_justify-end tw_items-center tw_gap-2 tw_mt-2">
        <span class="tw_text-xs tw_opacity-70">{{ newComment.length }} / 256 limit</span>
        <q-btn
          no-caps
          unelevated
          rounded
          :loading="loading"
          size="14px"
          color="primary"
          label="Comment"
          @click="postComment()"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
