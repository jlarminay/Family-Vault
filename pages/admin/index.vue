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

      <div class="tw_flex tw_flex-wrap">
        <AdminFunctionDisplay
          buttonLabel="Force Recheck S3 Storage"
          buttonAction="forceRecheckS3Bucket"
        >
          <template #title> Force Recheck S3 Storage </template>
          <template #description>
            <p class="tw_mb-2">
              This will get all files in s3 and check each one against the database.
            </p>
            <p class="tw_mb-2">Use this when uploading new files directly to s3.</p>
          </template>
        </AdminFunctionDisplay>

        <AdminFunctionDisplay buttonLabel="Recreate Thumbnails" buttonAction="updateThumbnail">
          <template #title>Recreate Thumbnails</template>
          <template #description>
            <p class="tw_mb-2">This will forcefully recreate all thumbnails for all files in s3.</p>
            <p class="tw_mb-2">All existing thumbnails will be replaced.</p>
          </template>
        </AdminFunctionDisplay>

        <AdminFunctionDisplay buttonLabel="Update All Permissions" buttonAction="updatePermissions">
          <template #title>Update All Permissions</template>
          <template #description>
            <p class="tw_mb-2">This will update all s3 files for public viewing.</p>
          </template>
        </AdminFunctionDisplay>
      </div>
    </main>
  </NuxtLayout>
</template>

<style scoped lang="postcss"></style>
