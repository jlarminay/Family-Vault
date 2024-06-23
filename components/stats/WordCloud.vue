<script setup lang="ts">
// @ts-ignore
import VueWordCloud from 'vuewordcloud';

const props = defineProps<{
  stats: {
    people: Record<string, number>;
  };
}>();

const words = computed(() => {
  if (!props.stats) return [];
  return Object.entries(props.stats).map(([text, weight]) => [text, weight]);
});
function color(scope: any) {
  const maxCount = Math.max(...words.value.map((word: any) => word[1]));
  const maxColor = hexToRgb('#833deb');
  const minColor = hexToRgb('#ee3664');
  const percentage = scope.weight / maxCount;
  // get the color between two colors at percentage
  const color = {
    r: Math.floor(minColor.r + (maxColor.r - minColor.r) * percentage),
    g: Math.floor(minColor.g + (maxColor.g - minColor.g) * percentage),
    b: Math.floor(minColor.b + (maxColor.b - minColor.b) * percentage),
  };
  return rgbToHex(color.r, color.g, color.b);
}
</script>

<template>
  <VueWordCloud
    style="height: 480px; width: 100%"
    :words="words"
    :color="color"
    font-family="Montserrat"
    :font-size-ratio="10"
  >
    <template v-slot="scope">
      <span :style="`color:${color(scope)}`">
        {{ scope.text }}
      </span>
    </template>
  </VueWordCloud>
</template>

<style scoped lang="postcss"></style>
