<script setup lang="ts">
import validator from 'validator';
const { data: authData } = useAuth();
definePageMeta({
  middleware: 'authorized-only',
});

const editForm = ref<any>(null);
const collectionStore = useCollectionStore();
const allCollections = ref(await collectionStore.getAll());
const selectedCollection = ref<any>(null);
const deleteModal = ref(false);
const editModal = ref(false);
const loading = ref(false);

async function confirmDelete() {
  loading.value = true;
  let response = await collectionStore.delete(selectedCollection.value.id);
  loading.value = false;
  if (!response) {
    toaster({ type: 'error', message: 'Something went wrong.<br/>Please try again later.' });
    return;
  }
  toaster({ type: 'success', message: 'Successfully deleted collection.' });
  deleteModal.value = false;
  allCollections.value = await collectionStore.getAll();
}
async function saveCollection() {
  if (!(await editForm.value.validate())) return;
  loading.value = true;
  let response = await collectionStore.createOrUpdate(selectedCollection.value);
  loading.value = false;
  if (!response) {
    toaster({ type: 'error', message: 'Something went wrong.<br/>Please try again later.' });
    return;
  }
  toaster({ type: 'success', message: 'Successfully updated collection.' });
  editModal.value = false;
  allCollections.value = await collectionStore.getAll();
}
</script>

<template>
  <Head>
    <title>Collections | Larminay Vault</title>
  </Head>

  <NuxtLayout name="app">
    <main class="tw_px-6 tw_py-4 tw_max-w-[1000px] tw_mx-auto">
      <div class="tw_flex tw_justify-between tw_items-center">
        <h1 class="h1">Collections</h1>
        <q-btn
          no-caps
          unelevated
          label="New Collection"
          color="primary"
          class="tw_mt-4"
          @click="
            selectedCollection = {};
            editModal = true;
          "
        />
      </div>
      <div class="tw_mt-6">
        <q-table
          flat
          :columns="[
            { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
            {
              name: 'description',
              label: 'Description',
              field: 'description',
              align: 'left',
              sortable: true,
            },
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
              <NuxtLink :to="`/videos/collection/${props.row.id}`" class="link">
                {{ props.row.name }}
              </NuxtLink>
            </q-td>
          </template>
          <template #body-cell-description="props">
            <q-td :props="props">
              <div class="tw_line-clamp-1">
                {{ props.row.description }}
              </div>
            </q-td>
          </template>
          <template #body-cell-videos="props">
            <q-td :props="props"> {{ props.row.videos }} Videos </q-td>
          </template>
          <template #body-cell-actions="props">
            <q-td :props="props" class="tw_w-0">
              <div class="actions tw_flex tw_justify-end tw_gap-1">
                <q-btn
                  round
                  flat
                  size="12px"
                  icon="sym_o_edit"
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
                  icon="sym_o_delete"
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
          <q-input
            outlined
            no-error-icon
            v-model="selectedCollection.description"
            label="Description"
            maxlength="1024"
            autogrow
            counter
            required
            :rules="[
              (val: string) => !!val || 'Required',
              (val: string) => val.length <= 1102428 || 'Max 1024 characters',
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
