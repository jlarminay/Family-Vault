<script setup lang="ts">
import L from 'leaflet';
import '@/assets/leaflet-heat/leaflet-heat.js';
import 'leaflet/dist/leaflet.css';

const props = defineProps<{
  location: {
    id: number;
    name: string;
    latLong: string;
    city: string;
    country: string;
  };
}>();

const map = ref<any>(null);
const tileSets = ref([
  'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
  'https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg',
]);

onMounted(() => {
  const latLong = props.location.latLong.split(',');
  map.value = L.map('map', {
    attributionControl: false,
    dragging: false,
    touchZoom: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
    zoomControl: false,
  }).setView([+latLong[0], +latLong[1]], 10);

  // add the OpenStreetMap tiles
  L.tileLayer(tileSets.value[0], {
    maxZoom: 16,
  }).addTo(map.value);

  // add marker
  L.marker([+latLong[0], +latLong[1]], {
    interactive: false,
  }).addTo(map.value);
});
</script>

<template>
  <div id="map" class="tw_w-full tw_aspect-square tw_rounded-md tw_border" />
</template>

<style scoped lang="postcss"></style>
