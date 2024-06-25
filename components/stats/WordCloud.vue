<script setup lang="ts">
// @ts-ignore
import VueWordCloud from 'vuewordcloud';

const props = defineProps<{
  stats: {
    people: Record<string, number>;
  };
}>();

const displayDuration = ref(false);
const words = computed(() => {
  if (!props.stats) return [];
  return Object.entries(props.stats).map(([text, counts]) => {
    return displayDuration.value ? [text, counts.duration] : [text, counts.clips];
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
    <div>
      <q-chip
        label="Number of clips"
        :class="{
          'tw_bg-primary tw_text-white': !displayDuration,
          'tw_bg-gray-500 tw_text-white': displayDuration,
        }"
        flat
        ripple
        clickable
        @click="displayDuration = false"
      />
      <q-chip
        label="Length of clips"
        :class="{
          'tw_bg-primary tw_text-white': displayDuration,
          'tw_bg-gray-500 tw_text-white': !displayDuration,
        }"
        flat
        ripple
        clickable
        @click="displayDuration = true"
      />
    </div>
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
