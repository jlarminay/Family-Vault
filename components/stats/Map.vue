<script setup lang="ts">
import L from 'leaflet';
import '@/assets/leaflet-heat.js';
// import 'leaflet.heat';
import 'leaflet/dist/leaflet.css';

const props = defineProps<{
  stats: { id: number; lat: number; lng: number; count: number }[];
}>();

const map = ref<any>(null);
const maps = ref([
  'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
  'https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg',
]);
const maxValue = ref(0);

onMounted(() => {
  map.value = L.map('map').setView([0, 0], 1);

  L.tileLayer(maps.value[0], {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 17,
  }).addTo(map.value);

  maxValue.value = Math.max(...props.stats.map((location) => location.count));

  // @ts-ignore
  L.heatLayer(
    props.stats.map((location) => [location.lat, location.lng, location.count / maxValue.value]),
    {
      minOpacity: 0.5,
      radius: 20,
    },
  ).addTo(map.value);
});
</script>

<template>
  <div>
    <h3 class="h2 tw_text-center tw_mb-4">
      World Heat Map
      <span class="tw_text-sm">({{ stats.length }} locations)</span>
    </h3>
    <div id="map" class="tw_h-[500px] tw_max-h-[80vh]"></div>
    <pre>{{
      stats.map((location) => [location.lat, location.lng, location.count / maxValue])
    }}</pre>
  </div>
</template>

<style scoped lang="postcss"></style>
~/assets/leaflet-heat~/assets/leaflet-heat
