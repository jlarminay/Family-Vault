<script setup>
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

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
  player.value = new Plyr('#videoPlayer', {
    controls: [
      'play-large', // The large play button in the center
      'play', // Play/pause playback
      'progress', // The progress bar and scrubber for playback and buffering
      'current-time', // The current time of playback
      'duration', // The full duration of the media
      'mute', // Toggle mute
      'pip', // Picture-in-picture (for HTML5)
      'airplay', // Airplay (for HTML5)
      'fullscreen', // Toggle fullscreen
    ],
  });
});
</script>

<template>
  <video id="videoPlayer" :poster="posterUrl">
    <source :src="videoUrl" type="video/mp4" />
  </video>
</template>

<style scoped lang="postcss"></style>
