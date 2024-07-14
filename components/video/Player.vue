<script setup lang="ts">
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

const emits = defineEmits(['initialPlay']);
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

const player = ref<any>(null);
const initialPlay = ref<boolean>(false);

onMounted(() => {
  player.value = new Plyr('#videoPlayer', {
    // controls: [
    //   'play-large', // The large play button in the center
    //   'play', // Play/pause playback
    //   'progress', // The progress bar and scrubber for playback and buffering
    //   'current-time', // The current time of playback
    //   'duration', // The full duration of the media
    //   'mute', // Toggle mute
    //   'fullscreen', // Toggle fullscreen
    // ],
    controls: `
      <div class="plyr__controls">
          <button type="button" class="plyr__control" data-plyr="rewind">
              <svg role="presentation"><use xlink:href="#plyr-rewind"></use></svg>
              <span class="plyr__tooltip" role="tooltip">Rewind {seektime} secs</span>
          </button>
          <button type="button" class="plyr__control" aria-label="Play, {title}" data-plyr="play">
              <svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-pause"></use></svg>
              <svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-play"></use></svg>
              <span class="label--pressed plyr__tooltip" role="tooltip">Pause</span>
              <span class="label--not-pressed plyr__tooltip" role="tooltip">Play</span>
          </button>
          <button type="button" class="plyr__control" data-plyr="fast-forward">
              <svg role="presentation"><use xlink:href="#plyr-fast-forward"></use></svg>
              <span class="plyr__tooltip" role="tooltip">Forward {seektime} secs</span>
          </button>
          <div class="plyr__progress">
              <input data-plyr="seek" type="range" min="0" max="100" step="0.01" value="0" aria-label="Seek">
              <progress class="plyr__progress__buffer" min="0" max="100" value="0">% buffered</progress>
              <span role="tooltip" class="plyr__tooltip">00:00</span>
          </div>
          <div class="plyr__time plyr__time--current" aria-label="Current time">00:00</div>
          <div class="plyr__time plyr__time--duration" aria-label="Duration">00:00</div>
          <button type="button" class="plyr__control" aria-label="Mute" data-plyr="mute">
              <svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-muted"></use></svg>
              <svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-volume"></use></svg>
              <span class="label--pressed plyr__tooltip" role="tooltip">Unmute</span>
              <span class="label--not-pressed plyr__tooltip" role="tooltip">Mute</span>
          </button>
          <button type="button" class="plyr__control tw_hidden" data-plyr="chromecast">
            <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
              <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
                  <g id="ic_cast_black_24dp" sketch:type="MSArtboardGroup">
                      <g id="ic_remove_circle_white_24dp" sketch:type="MSLayerGroup">
                          <path d="M1,18 L1,21 L4,21 C4,19.34 2.66,18 1,18 L1,18 Z M1,14 L1,16 C3.76,16 6,18.24 6,21 L8,21 C8,17.13 4.87,14 1,14 L1,14 Z M1,10 L1,12 C5.97,12 10,16.03 10,21 L12,21 C12,14.92 7.07,10 1,10 L1,10 Z M21,3 L3,3 C1.9,3 1,3.9 1,5 L1,8 L3,8 L3,5 L21,5 L21,19 L14,19 L14,21 L21,21 C22.1,21 23,20.1 23,19 L23,5 C23,3.9 22.1,3 21,3 L21,3 Z" id="cast" fill="#fff" sketch:type="MSShapeGroup"/>
                          <rect id="bounds" sketch:type="MSShapeGroup" x="0" y="0" width="24" height="24"/>
                      </g>
                  </g>
                  <g id="assets" sketch:type="MSLayerGroup" transform="translate(-208.000000, -106.000000)">
                      <g id="64px" transform="translate(0.000000, 114.000000)"/>
                  </g>
              </g>
            </svg>
            <span class="label--not-pressed plyr__tooltip" role="tooltip">Cast To TV</span>
          </button>
          <button type="button" class="plyr__control" data-plyr="fullscreen">
              <svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-exit-fullscreen"></use></svg>
              <svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-enter-fullscreen"></use></svg>
              <span class="label--pressed plyr__tooltip" role="tooltip">Exit fullscreen</span>
              <span class="label--not-pressed plyr__tooltip" role="tooltip">Enter fullscreen</span>
          </button>
      </div>`,
  });

  // add console for play button
  player.value.on('play', () => {
    if (!initialPlay.value) {
      initialPlay.value = true;
      emits('initialPlay');
    }
  });

  document.addEventListener('click', (event) => {
    if (!event.target) return;
    const targetElement = event.target as HTMLElement;
    if (targetElement.matches('[data-plyr="chromecast"]')) {
      // do chromecast stuff
      console.log('chromecast button clicked');
    }
  });
});
onUnmounted(() => {
  player.value.destroy();
  player.value = null;
});
</script>

<template>
  <video id="videoPlayer" playsinline controls :poster="posterUrl">
    <source :src="videoUrl" type="video/mp4" />
  </video>
</template>

<style scoped lang="postcss"></style>
