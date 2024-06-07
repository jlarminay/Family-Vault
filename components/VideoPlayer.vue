<script setup>
import Plyr from 'plyr';
import '/node_modules/plyr/dist/plyr.css';

const props = defineProps({
  options: {
    type: Object,
    default: () => ({}),
  },
  videoUrl: {
    type: String,
    required: true,
  },
  posterUrl: {
    type: String,
    required: true,
  },
});

const player = ref(null);

onMounted(() => {
  player.value = new Plyr('#videoPlayer');
});
</script>

<template>
  <video id="videoPlayer" :poster="posterUrl">
    <source :src="videoUrl" type="video/mp4" />
  </video>
</template>

<style scoped lang="postcss"></style>
