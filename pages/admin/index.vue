<script setup lang="ts">
definePageMeta({
  middleware: 'admin-authorized-only',
});

const adminStore = useAdminStore();
const loading = ref(false);

async function performS3Check(type: string) {
  loading.value = true;
  const response = await adminStore.s3Action(type);
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
          @click="performS3Check('forceRecheckS3Bucket')"
        />
        <q-btn
          label="Recreate Thumbnails"
          unelevated
          no-caps
          color="primary"
          :loading="loading"
          :disabled="loading"
          @click="performS3Check('updateThumbnail')"
        />
        <q-btn
          label="Update All Permissions"
          unelevated
          no-caps
          color="primary"
          :loading="loading"
          :disabled="loading"
          @click="performS3Check('updatePermissions')"
        />
        <!-- <q-btn
          label="Get All Files"
          unelevated
          no-caps
          color="primary"
          :loading="loading"
          :disabled="loading"
          @click="getAllFiles"
        /> -->
      </div>
    </main>
  </NuxtLayout>
</template>

<style scoped lang="postcss"></style>
