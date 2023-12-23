<script setup lang="ts">
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
  await commentStore.create(props.videoId, 1, newComment.value);
  newComment.value = '';
  loading.value = false;
  emit('commentPosted');
}
</script>

<template>
  <div class="tw_flex tw_gap-4 tw_items-start tw_mt-6 tw_group">
    <div class="tw_w-[40px] tw_h-[40px] tw_bg-gray-200 tw_rounded-full tw_overflow-hidden">
      <img
        src="https://cdn.quasar.dev/img/avatar.png"
        class="tw_w-full tw_h-full tw_object-cover"
      />
    </div>
    <div class="tw_flex-1">
      <q-input v-model="newComment" outlined dense autogrow placeholder="Add a comment..." />
      <div class="tw_flex tw_justify-end">
        <q-btn
          v-if="newComment !== ''"
          no-caps
          unelevated
          rounded
          :loading="loading"
          size="14px"
          color="primary"
          label="Comment"
          class="tw_mt-2"
          @click="postComment()"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
