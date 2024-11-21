<script setup lang="ts">
import dayjs from 'dayjs';

const showLegalModal = ref(false);
const initialLegalState = ref('');
</script>

<template>
  <footer class="tw_w-full tw_text-center tw_py-10">
    <div class="tw_flex tw_justify-center tw_mb-4">
      <img src="/logo/logo.svg" class="tw_w-10" />
    </div>
    <p class="tw_text-base tw_text-gray-500">
      © 2023-{{ dayjs().format('YYYY') }} Josh Larminay. All Rights Reserved.
    </p>
    <p>
      <span
        class="link"
        @click="
          initialLegalState = 'Privacy Policy';
          showLegalModal = true;
        "
      >
        Privacy Policy
      </span>
      |
      <span
        class="link"
        @click="
          initialLegalState = 'Terms and Conditions';
          showLegalModal = true;
        "
      >
        Terms and Conditions
      </span>
    </p>

    <LegalModal v-model="showLegalModal" :initialState="initialLegalState" />
  </footer>
</template>

<style scoped lang="postcss"></style>
