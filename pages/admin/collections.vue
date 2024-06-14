<script setup lang="ts">
definePageMeta({
  middleware: 'admin-authorized-only',
});

const editForm = ref<any>(null);
const adminStore = useAdminStore();
const allCollections = ref(await adminStore.collectionRead());
const selectedCollection = ref<any>(null);
const deleteModal = ref(false);
const editModal = ref(false);
const loading = ref(false);

async function confirmDelete() {
  loading.value = true;
  let response = await adminStore.collectionDelete(selectedCollection.value.id);
  loading.value = false;

  if (!response) {
    toaster({ type: 'error', message: 'Something went wrong.<br/>Please try again later.' });
    return;
  }
  toaster({ type: 'success', message: 'Successfully deleted collection.' });
  deleteModal.value = false;
  allCollections.value = await adminStore.collectionRead();
}
async function saveCollection() {
  if (!(await editForm.value.validate())) return;
  loading.value = true;
  let response;
  if (!selectedCollection.value.id)
    response = await adminStore.collectionCreate(selectedCollection.value);
  else response = await adminStore.collectionUpdate(selectedCollection.value);
  loading.value = false;

  if (!response) {
    toaster({ type: 'error', message: 'Something went wrong.<br/>Please try again later.' });
    return;
  }
  toaster({ type: 'success', message: 'Successfully updated collection.' });
  editModal.value = false;
  allCollections.value = await adminStore.collectionRead();
}
</script>

<template>
  <Head>
    <title>Collections | Admin | Larminay Vault</title>
  </Head>

  <NuxtLayout name="app">
    <main class="tw_p-1 sm:tw_px-6 sm:tw_py-4 tw_max-w-[1000px] tw_mx-auto">
      <AdminSectionHeader title="Collections">
        <q-btn
          no-caps
          unelevated
          label="New Collection"
          color="primary"
          @click="
            selectedCollection = {};
            editModal = true;
          "
        />
      </AdminSectionHeader>

      <div class="tw_mt-6">
        <q-table
          flat
          :columns="[
            { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
            {
              name: 'videos',
              label: 'Videos',
              field: 'videos',
              align: 'left',
              sortable: true,
            },
            { name: 'actions', label: '', field: 'actions', align: 'right', sortable: false },
          ]"
          :rows="allCollections"
          :wrap-cells="true"
          :rows-per-page-options="[25, 50, 100, 0]"
        >
          <template #body-cell-name="props">
            <q-td :props="props" class="tw_w-[250px]">
              {{ props.row.name }}
            </q-td>
          </template>
          <template #body-cell-videos="props">
            <q-td :props="props">{{ props.row.videos.length || 0 }} Videos</q-td>
          </template>
          <template #body-cell-actions="props">
            <q-td :props="props" class="tw_w-0">
              <div class="actions tw_flex tw_justify-end tw_gap-1">
                <q-btn
                  round
                  flat
                  size="12px"
                  icon="o_edit"
                  class="tw_text-blue-600"
                  @click="
                    editModal = true;
                    selectedCollection = JSON.parse(JSON.stringify(props.row));
                  "
                />
                <q-btn
                  round
                  flat
                  size="12px"
                  icon="o_delete"
                  class="tw_text-red-600"
                  @click="
                    deleteModal = true;
                    selectedCollection = JSON.parse(JSON.stringify(props.row));
                  "
                />
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

    <Modal v-model="editModal">
      <template #title>Edit Collection</template>
      <template #body>
        <q-form greedy ref="editForm" @submit.prevent="saveCollection">
          <q-input
            outlined
            no-error-icon
            v-model="selectedCollection.name"
            label="Name"
            maxlength="64"
            autogrow
            counter
            required
            :rules="[
              (val: string) => !!val || 'Required',
              (val: string) => val.length <= 64 || 'Max 64 characters',
            ]"
          />
        </q-form>
      </template>
      <template #actions>
        <q-btn outline unelevated no-caps label="Cancel" color="dark" v-close-popup />
        <q-btn
          no-caps
          unelevated
          label="Save"
          color="primary"
          :loading="loading"
          @click="saveCollection"
        />
      </template>
    </Modal>
    <Modal v-model="deleteModal">
      <template #title>Delete Collection</template>
      <template #body>Are you sure you want to delete this collection?</template>
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
