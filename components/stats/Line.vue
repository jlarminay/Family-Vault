<script setup lang="ts">
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js';
ChartJS.register(Title, Tooltip, BarElement, CategoryScale, LinearScale, PointElement, LineElement);

const props = defineProps<{
  stats: { [key: string]: { images: number; videos: number } };
}>();

const labels = computed(() => {
  if (!props.stats) return [];
  return Object.keys(props.stats) as string[];
});
const dataImages = computed(() => {
  if (!props.stats) return [];
  return (Object.values(props.stats) as any).map((value: any) => {
    return value.images;
  });
});
const dataVideos = computed(() => {
  if (!props.stats) return [];
  return (Object.values(props.stats) as any).map((value: any) => {
    return value.videos;
  });
});
</script>

<template>
  <div class="tw_pb-16">
    <h3 class="h2 tw_text-center tw_mb-4">Videos and Images Per Year</h3>
    <Bar
      :options="{
        responsive: true,
        maintainAspectRatio: false,
        resizeDelay: 200,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        scales: {
          y: {
            beginAtZero: true,
            stacked: true,
          },
          x: {
            stacked: true,
          },
        },
      }"
      :data="{
        labels: labels,
        datasets: [
          {
            label: 'Images',
            data: dataImages,
            backgroundColor: '#ee3664',
          },
          {
            label: 'Videos',
            data: dataVideos,
            backgroundColor: '#833deb',
          },
        ],
      }"
      class="tw_w-full"
    />
  </div>
</template>

<style scoped lang="postcss"></style>
