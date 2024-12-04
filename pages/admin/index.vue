<script setup lang="ts">
definePageMeta({
  middleware: 'admin-authorized-only',
});

const settingStore = useSettingStore();
const allSettings = ref(await settingStore.getAll());
</script>

<template>
  <Head>
    <title>Admin | Larminay Vault</title>
  </Head>

  <NuxtLayout name="app">
    <main class="tw_p-1 sm:tw_px-6 sm:tw_py-4 tw_max-w-[1000px] tw_mx-auto">
      <AdminSectionHeader />

      <pre>{{ allSettings }}</pre>
      <div class="tw_flex tw_flex-wrap tw_gap-y-2">
        <AdminFunctionDisplay
          buttonLabel="Force Recheck"
          buttonAction="forceRecheckS3Bucket"
          :estimate="allSettings?.timerForceRecheckS3Bucket"
        >
          <template #title> Force Recheck S3 Storage </template>
          <template #description>
            <p class="tw_mb-2">
              This will get all files in s3 and check each one against the database.
            </p>
            <p class="tw_mb-2">Use this when uploading new files directly to s3.</p>
          </template>
        </AdminFunctionDisplay>

        <AdminFunctionDisplay
          buttonLabel="Fix Thumbnails"
          buttonAction="getMissingThumbnails"
          :estimate="allSettings?.timerGetMissingThumbnails"
        >
          <template #title>Fix Missing Thumbnails</template>
          <template #description>
            <p class="tw_mb-2">This will create thumbnails for all missing items.</p>
            <p class="tw_mb-2">This will not delete any exiting items.</p>
          </template>
        </AdminFunctionDisplay>

        <AdminFunctionDisplay
          buttonLabel="Update Permissions"
          buttonAction="updatePermissions"
          :estimate="allSettings?.timerUpdatePermissions"
        >
          <template #title>Update All Permissions</template>
          <template #description>
            <p class="tw_mb-2">This will update all s3 files for public viewing.</p>
          </template>
        </AdminFunctionDisplay>

        <AdminFunctionDisplay
          buttonLabel="Recreate Thumbnails"
          buttonAction="recreateThumbnail"
          :estimate="allSettings?.timerRecreateAllThumbnails"
        >
          <template #title>Recreate Thumbnails</template>
          <template #description>
            <p class="tw_mb-2">This will forcefully recreate all thumbnails for all files in s3.</p>
            <p class="tw_mb-2">All existing thumbnails will be replaced.</p>
          </template>
        </AdminFunctionDisplay>
      </div>
    </main>
  </NuxtLayout>
</template>

<style scoped lang="postcss"></style>
