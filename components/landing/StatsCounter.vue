<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
});

const cleanedNumber = computed(() => {
  let paddedNumber;
  paddedNumber = String(props.count).padEnd(5, '-');
  paddedNumber = paddedNumber.split('');
  return paddedNumber.map((digit) => parseInt(digit === '-' ? '-1' : digit));
});
</script>

<template>
  <div class="tw_w-full tw_flex tw_justify-center tw_items-center tw_gap-3 tw_mb-4 tw_text-primary">
    <div>
      <div class="tw_flex tw_items-end tw_justify-center">
        <LandingStatsCounterDigit :number="cleanedNumber[0]" />
        <LandingStatsCounterDigit :number="cleanedNumber[1]" />
        <LandingStatsCounterDigit :number="cleanedNumber[2]" />
        <LandingStatsCounterDigit :number="cleanedNumber[3]" />
        <LandingStatsCounterDigit :number="cleanedNumber[4]" />
        <span class="tw_text-4xl tw_font-extrabold tw_mb-[-4px] tw_h-[40px] tw_leading-[40px]">
          +
        </span>
      </div>
      <div class="tw_text-xl tw_text-black-2 tw_mt-2">{{ label }}</div>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
