<script setup lang="ts">
definePageMeta({
  middleware: 'admin-authorized-only',
});

const adminStore = useAdminStore();
const allVideos = ref(await adminStore.videoRead());
</script>

<template>
  <Head>
    <title>Videos | Admin | Larminay Vault</title>
  </Head>

  <NuxtLayout name="app">
    <main class="tw_p-1 sm:tw_px-6 sm:tw_py-4 tw_max-w-[1000px] tw_mx-auto">
      <AdminSectionHeader title="Collections" />

      <div class="tw_mt-6">
        <q-table
          flat
          :columns="[
            { name: 'title', label: 'Title', field: 'title', align: 'left', sortable: true },
            {
              name: 'owner',
              label: 'Owner',
              field: 'owner',
              align: 'left',
              sortable: true,
            },
            {
              name: 'createdAt',
              label: 'Created At',
              field: 'createdAt',
              align: 'left',
              sortable: true,
            },
          ]"
          behavior="menu"
          :rows="allVideos"
          :wrap-cells="true"
          :rows-per-page-options="[25, 50, 100, 0]"
        >
          <template #body-cell-title="props">
            <q-td :props="props">
              <div class="tw_flex tw_items-center tw_justify-start">
                <q-icon
                  v-if="props.row.published === 'private'"
                  name="lock"
                  class="tw_text-primary tw_text-base tw_rounded-full tw_mr-2"
                />
                <NuxtLink :to="`/video/${props.row.id}`" class="link tw_line-clamp-1">
                  {{ props.row.title }}
                </NuxtLink>
              </div>
            </q-td>
          </template>
          <template #body-cell-createdAt="props">
            <q-td :props="props">
              <div class="tw_line-clamp-1">
                {{ $dayjs(props.row.createdAt).format('MMM D, YYYY') }}
              </div>
            </q-td>
          </template>
          <template #body-cell-owner="props">
            <q-td :props="props">
              <div class="tw_line-clamp-1">
                {{ props.row.owner.name }}
              </div>
            </q-td>
          </template>

          <template #no-data>
            <div class="tw_w-full tw_text-center">
              <p class="tw_text-lg tw_italic tw_opacity-70">No collections found.</p>
            </div>
          </template>
        </q-table>
      </div>
    </main>
  </NuxtLayout>
</template>

<style scoped lang="postcss">
:deep(.q-table) {
  thead th {
    @apply tw_text-base tw_font-bold tw_whitespace-nowrap;
  }

  .q-td {
    @apply tw_text-base;
  }

  tbody tr {
    .actions {
      @apply tw_opacity-0 tw_transition-opacity tw_duration-300;
    }
    &:hover .actions {
      @apply tw_opacity-100;
    }
  }
}
</style>
