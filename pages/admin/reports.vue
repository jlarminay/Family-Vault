<script setup lang="ts">
definePageMeta({
  middleware: 'admin-authorized-only',
});

const adminStore = useAdminStore();
const allReports = ref(await adminStore.reportRead());
const selectedReport = ref<any>(null);
const deleteModal = ref(false);
const loading = ref(false);

async function confirmDelete() {
  loading.value = true;
  let response = await adminStore.reportDelete(selectedReport.value);
  loading.value = false;

  if (!response) {
    toaster({ type: 'error', message: 'Something went wrong.<br/>Please try again later.' });
    return;
  }
  toaster({ type: 'success', message: 'Successfully deleted report.' });
  deleteModal.value = false;
  allReports.value = await adminStore.reportRead();
}
</script>

<template>
  <Head>
    <title>Reports | Admin | Larminay Vault</title>
  </Head>

  <NuxtLayout name="app">
    <main class="tw_px-6 tw_py-4 tw_max-w-[1000px] tw_mx-auto">
      <AdminSectionHeader title="Reports" />

      <div class="tw_mt-6">
        <q-table
          flat
          :columns="[
            { name: 'user', label: 'Reporter', field: 'user', align: 'left', sortable: true },
            { name: 'video', label: 'Video', field: 'video', align: 'left', sortable: true },
            { name: 'report', label: 'Report', field: 'report', align: 'left', sortable: true },
            {
              name: 'createdAt',
              label: 'Submitted',
              field: 'createdAt',
              align: 'left',
              sortable: true,
            },
            { name: 'actions', label: '', field: 'actions', align: 'left', sortable: false },
          ]"
          :rows="allReports"
          :wrap-cells="true"
          :rows-per-page-options="[25, 50, 100, 0]"
        >
          <template #body-cell-user="props">
            <q-td :props="props" class="tw_truncate tw_max-w-[200px]">
              {{ props.row.user.name }}
            </q-td>
          </template>
          <template #body-cell-video="props">
            <q-td :props="props" class="tw_truncate tw_max-w-[200px]">
              <NuxtLink class="link" :to="`/video/${props.row.video.id}`">
                {{ props.row.video.title }}
              </NuxtLink>
            </q-td>
          </template>
          <template #body-cell-report="props">
            <q-td :props="props">
              {{ props.row.report }}
            </q-td>
          </template>
          <template #body-cell-createdAt="props">
            <q-td :props="props" class="tw_whitespace-nowrap">
              {{ $dayjs(props.row.createdAt).format('MMM D, YYYY') }}
            </q-td>
          </template>
          <template #body-cell-actions="props">
            <q-td :props="props" class="tw_w-0">
              <div class="actions">
                <q-btn
                  round
                  flat
                  size="12px"
                  icon="sym_o_delete_outline"
                  class="tw_text-red-600"
                  @click="
                    deleteModal = true;
                    selectedReport = props.row.id;
                  "
                />
              </div>
            </q-td>
          </template>

          <template #no-data>
            <div class="tw_w-full tw_text-center">
              <p class="tw_text-lg tw_italic tw_opacity-70">No reports found.</p>
            </div>
          </template>
        </q-table>
      </div>
    </main>

    <Modal v-model="deleteModal" ref="modal">
      <template #title>Delete Report</template>
      <template #body>Are you sure you want to delete this report?</template>
      <template #actions>
        <q-btn outline unelevated no-caps label="Cancel" color="dark" v-close-popup />
        <q-btn
          no-caps
          unelevated
          label="Confirm Delete"
          color="primary"
          :loading="loading"
          @click="confirmDelete"
        />
      </template>
    </Modal>
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
