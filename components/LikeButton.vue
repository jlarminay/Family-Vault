<script setup lang="ts">
const emits = defineEmits(['updateLike']);
const props = defineProps({
  itemId: {
    type: Number,
    required: true,
  },
});

const likeStore = useLikeStore();
const likeData = ref<any>(null);
const loading = ref(false);
const clickedOnce = ref(false);

watch(
  () => props.itemId,
  async (id) => {
    likeData.value = await likeStore.getForVideo(id);
  },
  { immediate: true },
);

async function updateLike() {
  loading.value = true;
  clickedOnce.value = true;
  await likeStore.update(props.itemId, !likeData.value.isLiked);
  likeData.value = await likeStore.getForVideo(props.itemId);
  emits('updateLike');
  loading.value = false;
}
</script>

<template>
  <q-btn v-if="likeData" round flat :disable="loading" :loading="loading" @click="updateLike">
    <q-icon
      :name="likeData.isLiked ? 'o_favorite' : 'o_favorite_border'"
      :class="{
        'tw_text-red-500': likeData.isLiked,
        // tada: likeData.isLiked && clickedOnce,
      }"
    />
  </q-btn>
</template>

<style scoped lang="postcss"></style>
