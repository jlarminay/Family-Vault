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

      <div class="tw_flex tw_flex-wrap tw_gap-y-2">
        <AdminFunctionDisplay
          buttonLabel="Force Recheck"
          buttonAction="forceRecheckS3Bucket"
          :estimate="allSettings?.timerForceRecheckS3Bucket"
        >
          <template #title> Force Recheck S3 Storage </template>
          <template #description>
            <p class="tw_mb-2">Sync S3 files with the database. Use after direct uploads to S3.</p>
          </template>
        </AdminFunctionDisplay>

        <AdminFunctionDisplay
          buttonLabel="Fix Thumbnails"
          buttonAction="getMissingThumbnails"
          :estimate="allSettings?.timerGetMissingThumbnails"
        >
          <template #title>Fix Missing Thumbnails</template>
          <template #description>
            <p class="tw_mb-2">
              Generate thumbnails for missing items without affecting existing ones.
            </p>
          </template>
        </AdminFunctionDisplay>

        <AdminFunctionDisplay
          buttonLabel="Update Permissions"
          buttonAction="updatePermissions"
          :estimate="allSettings?.timerUpdatePermissions"
        >
          <template #title>Update All Permissions</template>
          <template #description>
            <p class="tw_mb-2">Set all S3 files for public access.</p>
          </template>
        </AdminFunctionDisplay>

        <AdminFunctionDisplay
          buttonLabel="Recreate Thumbnails"
          buttonAction="recreateThumbnail"
          :estimate="allSettings?.timerRecreateAllThumbnails"
        >
          <template #title>Recreate Thumbnails</template>
          <template #description>
            <p class="tw_mb-2">Regenerate all S3 thumbnails, replacing existing ones.</p>
            <p class="tw_mb-2">All existing thumbnails will be replaced.</p>
          </template>
        </AdminFunctionDisplay>
      </div>
    </main>
  </NuxtLayout>
</template>

<style scoped lang="postcss"></style>
