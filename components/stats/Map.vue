<script setup lang="ts">
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const props = defineProps<{
  stats: { lat: number; lng: number }[];
}>();

const map = ref<any>(null);

onMounted(() => {
  map.value = L.map('map').setView([0, 0], 1);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map.value);

  props.stats.forEach((location) => {
    L.marker([location.lat, location.lng]).addTo(map.value);
  });
});
</script>

<template>
  <div>
    <h3 class="h2 tw_text-center tw_mb-4">World Heat Map</h3>
    <div id="map" class="tw_h-[500px] tw_max-h-[80vh]"></div>
  </div>
</template>

<style scoped lang="postcss"></style>
