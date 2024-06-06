<script setup lang="ts">
definePageMeta({
  middleware: 'authorized-only',
});
const { data: authData } = useAuth();
</script>

<template>
  <Head>
    <title>Account | Larminay Vault</title>
  </Head>

  <NuxtLayout name="app">
    <main class="tw_px-6 tw_py-4 tw_max-w-[1400px] tw_mx-auto">
      <pre>{{ authData }}</pre>
    </main>
  </NuxtLayout>
</template>

<style scoped lang="postcss"></style>
