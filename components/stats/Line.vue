<script setup lang="ts">
import { Line } from 'vue-chartjs';
import dayjs from 'dayjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js';
ChartJS.register(Title, Tooltip, BarElement, CategoryScale, LinearScale, PointElement, LineElement);

const props = defineProps<{
  stats: {
    months: Record<string, number>;
  };
}>();

const labels = computed(() => {
  if (!props.stats) return [];
  return (Object.keys(props.stats) as string[]).map((month) => {
    return dayjs(month).format('YYYY');
  });
});
const data = computed(() => {
  if (!props.stats) return [];
  return Object.values(props.stats) as unknown as number[];
});
</script>

<template>
  <Line
    :chartOptions="{
      responsive: true,
      maintainAspectRatio: true,
      resizeDelay: 200,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    }"
    :data="{
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: '#000000',
          borderColor: '#833deb80',
          fill: true,
          tension: 0.25,
        },
      ],
    }"
    class="tw_w-full"
  />
</template>

<style scoped lang="postcss"></style>
