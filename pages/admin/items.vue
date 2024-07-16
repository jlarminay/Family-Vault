<script setup lang="ts">
import dayjs from 'dayjs';

definePageMeta({
  middleware: 'admin-authorized-only',
});

const adminStore = useAdminStore();
const allVideos = ref(await adminStore.itemRead());
</script>

<template>
  <Head>
    <title>Items | Admin | Larminay Vault</title>
  </Head>

  <NuxtLayout name="app">
    <main class="tw_p-1 sm:tw_px-6 sm:tw_py-4 tw_max-w-[1000px] tw_mx-auto">
      <AdminSectionHeader title="Items" />

      <div class="tw_mt-6">
        <q-table
          flat
          :columns="[
            { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
            {
              name: 'owner',
              label: 'Owner',
              field: 'owner',
              align: 'left',
              sortable: true,
            },
            {
              name: 'takenAt',
              label: 'Taken At',
              field: 'takenAt',
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
          <template #body-cell-name="props">
            <q-td :props="props">
              {{ props.row.name }}
            </q-td>
          </template>
          <template #body-cell-owner="props">
            <q-td :props="props">
              <div class="tw_line-clamp-1">
                {{ props.row.owner.name }}
              </div>
            </q-td>
          </template>
          <template #body-cell-takenAt="props">
            <q-td :props="props">
              <div class="tw_line-clamp-1">
                {{ dayjs(props.row.takenAt).format('MMM D, YYYY') }}
              </div>
            </q-td>
          </template>
          <template #body-cell-createdAt="props">
            <q-td :props="props">
              <div class="tw_line-clamp-1">
                {{ dayjs(props.row.createdAt).format('MMM D, YYYY') }}
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
