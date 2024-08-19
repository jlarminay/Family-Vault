<script setup lang="ts">
import { gsap } from 'gsap';

const slider = ref<any>(null);
const props = defineProps({
  number: {
    type: Number,
    required: true,
  },
});

const firstLoad = ref(true);

onMounted(() => {
  changeNumber(props.number);
});
watch(
  () => props.number,
  (newCount, _oldCount) => {
    changeNumber(newCount);
  },
);

async function changeNumber(newNumber: number) {
  // add delay for first load
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (newNumber >= 0) slider.value.classList.remove('tw_w-0');
  else slider.value.classList.add('tw_w-0');

  const duration = firstLoad.value ? 0 : Math.random() * (1.5 - 1) + 1; //  random duration between 0.5 and 1.5

  gsap.to(slider.value, {
    duration: duration,
    marginTop: `${-(60 * newNumber)}px`,
    ease: 'bounce.out',
    onComplete: () => {
      firstLoad.value = false;
    },
  });
}
</script>

<template>
  <div>
    <div
      class="tw_text-6xl tw_font-extrabold tw_mb-[-4px] tw_h-[60px] tw_leading-[60px] tw_overflow-hidden"
    >
      <div
        ref="slider"
        class="tw_flex tw_flex-col tw_justify-center tw_transition-[width] tw_duration-300"
        style="margin-top: 0px"
      >
        <div class="digit">0</div>
        <div class="digit">1</div>
        <div class="digit">2</div>
        <div class="digit">3</div>
        <div class="digit">4</div>
        <div class="digit">5</div>
        <div class="digit">6</div>
        <div class="digit">7</div>
        <div class="digit">8</div>
        <div class="digit">9</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.digit {
  @apply tw_text-center;
}
</style>
