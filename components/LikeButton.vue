<script setup lang="ts">
const props = defineProps({
  itemId: {
    type: Number,
    required: true,
  },
});

const likeStore = useLikeStore();
const likeData = ref(await likeStore.getForVideo(props.itemId));
const loading = ref(false);
const clickedOnce = ref(false);

async function updateLike() {
  loading.value = true;
  clickedOnce.value = true;
  await likeStore.update(props.itemId, !likeData.value.isLiked);
  likeData.value = await likeStore.getForVideo(props.itemId);
  loading.value = false;
}
</script>

<template>
  <q-btn round flat :disable="loading" :loading="loading" @click="updateLike">
    <q-icon
      :name="likeData.isLiked ? 'o_favorite' : 'o_favorite_border'"
      :class="{
        'tw_text-red-500': likeData.isLiked,
        tada: likeData.isLiked && clickedOnce,
      }"
    />
  </q-btn>
</template>

<style scoped lang="postcss"></style>
