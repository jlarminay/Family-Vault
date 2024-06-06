<script setup lang="ts">
definePageMeta({
  middleware: 'authorized-only',
});
</script>

<template>
  <Head>
    <title>Admin | Larminay Vault</title>
  </Head>

  <NuxtLayout name="app">
    <main class="tw_px-6 tw_py-4 tw_max-w-[1400px] tw_mx-auto">
      <h1 class="h1">Admin</h1>
      <div class="tw_mt-6">
        <div class="tw_flex tw_gap-2">
          <q-btn no-caps outline to="/admin/users" label="Users" />
          <q-btn no-caps outline to="/admin/reports" label="Reports" />
          <q-btn no-caps outline to="/admin/collections" label="Collections" />
        </div>
      </div>
    </main>
  </NuxtLayout>
</template>

<style scoped lang="postcss"></style>
