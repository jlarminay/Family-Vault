<script setup lang="ts">
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
ChartJS.register(ArcElement, Tooltip);

const emits = defineEmits(['clips', 'duration']);
const props = defineProps<{
  stats: {
    formats: Record<string, { clips: number; duration: number }>;
  };
  displayType: 'clips' | 'duration';
}>();
const labels = computed(() => {
  if (!props.stats) return [];
  return Object.keys(props.stats) as string[];
});
const data = computed(() => {
  if (!props.stats) return [];
  // get the number of clips or the duration of clips for each month
  return (Object.values(props.stats) as any).map((value: any) => {
    return props.displayType === 'duration' ? value.duration : value.clips;
  });
});

// get one color for each item between 2 colors #ee3664 and #833deb
// use functions rgbToHex and hexToRgb to convert between rgb and hex
const colors = computed(() => {
  const color1 = hexToRgb('#ee3664');
  const color2 = hexToRgb('#833deb');
  const steps = data.value.length;
  const colors = [];
  for (let i = 0; i < steps; i++) {
    const r = Math.round(color1.r + ((color2.r - color1.r) / steps) * i);
    const g = Math.round(color1.g + ((color2.g - color1.g) / steps) * i);
    const b = Math.round(color1.b + ((color2.b - color1.b) / steps) * i);
    colors.push(rgbToHex(r, g, b));
  }
  return colors;
});
</script>

<template>
  <div>
    <div>
      <q-chip
        label="Number of clips"
        :class="{
          'tw_bg-primary tw_text-white': props.displayType === 'clips',
          'tw_bg-gray-500 tw_text-white': props.displayType !== 'clips',
        }"
        flat
        ripple
        clickable
        @click="emits('clips')"
      />
      <q-chip
        label="Length of clips"
        :class="{
          'tw_bg-primary tw_text-white': props.displayType === 'duration',
          'tw_bg-gray-500 tw_text-white': props.displayType !== 'duration',
        }"
        flat
        ripple
        clickable
        @click="emits('duration')"
      />
    </div>

    <Pie
      :chartOptions="{
        responsive: true,
        maintainAspectRatio: true,
        resizeDelay: 200,
      }"
      :data="{
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: colors,
          },
        ],
      }"
    />
  </div>
</template>

<style scoped lang="postcss"></style>
