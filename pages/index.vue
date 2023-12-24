<script setup lang="ts">
definePageMeta({
  title: 'Welcome',
});
</script>

<template>
  <div
    class="tw_flex tw_justify-center tw_items-center tw_h-[100svh] tw_bg-gradient-to-tr tw_from-primary tw_to-secondary"
  >
    <div class="tw_text-center">
      <p class="tw_mb-4 tw_px-4 tw_pb-2 tw_text-2xl tw_text-white tw_border-b tw_inline-block">
        Larminay Vault
      </p>
      <h1 class="tw_text-6xl tw_text-white tw_uppercase tw_font-montserrat">
        Exciting news <br />
        coming soon
      </h1>
      <q-btn
        label="Login"
        outline
        rounded
        no-caps
        size="16px"
        color="white"
        class="tw_mt-4 tw_px-10"
        to="/login"
      />
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
