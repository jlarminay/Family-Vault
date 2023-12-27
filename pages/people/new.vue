<script setup lang="ts">
definePageMeta({
  middleware: 'authorized-only',
});

const personStore = usePersonStore();
</script>

<template>
  <Head>
    <title>New Person | Larminay Vault</title>
  </Head>

  <div>
    <SingleNavMenu />

    <div class="tw_px-6 tw_py-4 tw_max-w-[800px] tw_mx-auto">
      <h1 class="h1">New Person</h1>

      <div class="tw_mt-6 tw_flex tw_flex-wrap">NEW</div>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
