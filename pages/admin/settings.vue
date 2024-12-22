<script setup lang="ts">
definePageMeta({
  middleware: 'admin-authorized-only',
});

const settingStore = useSettingStore();
const allSettings = ref(await settingStore.getAll());
</script>

<template>
  <Head>
    <title>Settings | Admin | Larminay Vault</title>
  </Head>

  <NuxtLayout name="app">
    <main class="tw_p-1 sm:tw_px-6 sm:tw_py-4 tw_max-w-[1000px] tw_mx-auto">
      <AdminSectionHeader title="Settings" />

      <div>
        <pre>{{ allSettings }}</pre>
        <pre>{{ $pwa }}</pre>
      </div>
    </main>
  </NuxtLayout>
</template>

<style scoped lang="postcss"></style>
