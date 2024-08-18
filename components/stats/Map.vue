<script setup lang="ts">
import L from 'leaflet';
import '@/assets/leaflet-heat/leaflet-heat.js';
import 'leaflet/dist/leaflet.css';

const props = defineProps<{
  stats: {
    id: number;
    name: string | null;
    city: string | null;
    country: string | null;
    lat: number;
    lng: number;
    count: number;
  }[];
}>();

const map = ref<any>(null);
const mapLayer = ref<any>(null);
const tileSets = ref([
  'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
  'https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg',
]);
const maxValue = ref(0);

onMounted(() => {
  map.value = L.map('map').setView([30, -40], 2);

  // add the OpenStreetMap tiles
  L.tileLayer(tileSets.value[0], {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 17,
  }).addTo(map.value);

  // add the Heatmap layer
  maxValue.value = Math.max(...props.stats.map((location) => location.count));
  // @ts-ignore
  L.heatLayer(
    props.stats.map((location) => [location.lat, location.lng, location.count / maxValue.value]),
    {
      minOpacity: 0.5,
      radius: 20,
    },
  ).addTo(map.value);

  // add map markers
  updateMapMarkers();
  map.value.on('zoomend', updateMapMarkers);
});

function updateMapMarkers() {
  // create layer if it doesn't exist
  if (!mapLayer.value) {
    // create a layer group
    mapLayer.value = L.layerGroup().addTo(map.value);

    // add markers
    props.stats.forEach((location) => {
      // skip if no name
      if (!location.name) return;
      L.marker([location.lat, location.lng])
        .addTo(mapLayer.value)
        .bindPopup(`<b>${location.name}</b><br/>${location.city}, ${location.country}`);
    });
  }

  // check zoom level
  const zoomLevel = map.value.getZoom();
  if (zoomLevel < 10) {
    map.value.removeLayer(mapLayer.value);
  } else {
    map.value.addLayer(mapLayer.value);
  }
}
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
~/assets/leaflet-heat~/assets/leaflet-heat
