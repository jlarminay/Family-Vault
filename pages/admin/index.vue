<script setup lang="ts">
definePageMeta({
  middleware: 'admin-authorized-only',
});
</script>

<template>
  <Head>
    <title>Admin | Larminay Vault</title>
  </Head>

  <NuxtLayout name="app">
    <main class="tw_p-1 sm:tw_px-6 sm:tw_py-4 tw_max-w-[1000px] tw_mx-auto">
      <AdminSectionHeader />

      <div>Body goes here</div>
    </main>
  </NuxtLayout>
</template>

<style scoped lang="postcss"></style>
