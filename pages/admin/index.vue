<script setup lang="ts">
definePageMeta({
  middleware: 'admin-authorized-only',
});

const adminStore = useAdminStore();
const loading = ref(false);

async function forceRecheckS3Storage() {
  loading.value = true;
  const response = await adminStore.forceRecheckS3Bucket();
  console.log(response);
  loading.value = false;
}
async function getAllFiles() {
  loading.value = true;
  const response = await adminStore.getAllFiles();
  console.log(response);
  loading.value = false;
}
</script>

<template>
  <Head>
    <title>Admin | Larminay Vault</title>
  </Head>

  <NuxtLayout name="app">
    <main class="tw_p-1 sm:tw_px-6 sm:tw_py-4 tw_max-w-[1000px] tw_mx-auto">
      <AdminSectionHeader />

      <div class="tw_flex tw_gap-2 tw_flex-wrap">
        <q-btn
          label="Force Recheck S3 Storage"
          unelevated
          no-caps
          color="primary"
          :loading="loading"
          :disabled="loading"
          @click="forceRecheckS3Storage"
        />
        <q-btn
          label="Get All Files"
          unelevated
          no-caps
          color="primary"
          :loading="loading"
          :disabled="loading"
          @click="getAllFiles"
        />
      </div>
    </main>
  </NuxtLayout>
</template>

<style scoped lang="postcss"></style>
