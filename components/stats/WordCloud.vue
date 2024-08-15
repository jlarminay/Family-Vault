<script setup lang="ts">
// @ts-ignore
import VueWordCloud from 'vuewordcloud';

const props = defineProps<{
  stats: { [key: string]: number };
}>();

const words = computed(() => {
  if (!props.stats) return [];
  return Object.entries(props.stats).map(([text, counts]) => {
    return [text, counts];
  });
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
  <div>
    <h3 class="h2 tw_text-center tw_mb-4">People Word Cloud</h3>
    <div class="tw_flex tw_justify-center">
      <VueWordCloud
        style="height: 480px; width: 100%"
        :words="words"
        :color="color"
        font-family="Montserrat"
        :font-size-ratio="3"
        class="tw_w-full sm:!tw_w-[80%]"
      >
        <template v-slot="scope">
          <span :style="`color:${color(scope)}`">{{ scope.text }}</span>
        </template>
      </VueWordCloud>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
