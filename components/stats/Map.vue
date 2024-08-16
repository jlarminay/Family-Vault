<script setup lang="ts">
import L from 'leaflet';
import 'leaflet.heat';
import 'leaflet/dist/leaflet.css';

const props = defineProps<{
  stats: { lat: number; lng: number }[];
}>();

const map = ref<any>(null);
const maps = ref([
  'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
  'https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg',
]);

onMounted(() => {
  map.value = L.map('map').setView([0, 0], 1);

  L.tileLayer(maps.value[0], {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 17,
  }).addTo(map.value);

  // @ts-ignore
  L.heatLayer(
    props.stats.map((location) => [location.lat, location.lng, 1]),
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
  </div>
</template>

<style scoped lang="postcss"></style>
