<script setup lang="ts">
import dayjs from 'dayjs';
</script>

<template>
  <footer class="tw_w-full tw_text-center tw_pb-4 tw_pt-10">
    <div class="tw_flex tw_justify-center tw_mb-4">
      <img src="/logo/logo.svg" class="tw_w-10" />
    </div>
    <p class="tw_text-base tw_text-gray-500">
      © 2023-{{ dayjs().format('YYYY') }} Josh Larminay. All Rights Reserved.
    </p>
  </footer>
</template>

<style scoped lang="postcss"></style>
