<script setup lang="ts">
import dayjs from 'dayjs';
definePageMeta({
  middleware: 'admin-authorized-only',
});

const editForm = ref<any>(null);
const adminStore = useAdminStore();
const allPersons = ref(await adminStore.personRead());
const selectedPerson = ref<any>(null);
const deleteModal = ref(false);
const editModal = ref(false);
const loading = ref(false);

async function confirmDelete() {
  loading.value = true;
  let response = await adminStore.personDelete(selectedPerson.value.id);
  loading.value = false;

  if (!response) {
    toaster({ type: 'error', message: 'Something went wrong.<br/>Please try again later.' });
    return;
  }
  toaster({ type: 'success', message: 'Successfully deleted person.' });
  deleteModal.value = false;
  allPersons.value = await adminStore.personRead();
}
async function savePerson() {
  if (!(await editForm.value.validate())) return;
  loading.value = true;
  let response;
  if (!selectedPerson.value.id) response = await adminStore.personCreate(selectedPerson.value);
  else response = await adminStore.personUpdate(selectedPerson.value);
  loading.value = false;

  if (!response) {
    toaster({ type: 'error', message: 'Something went wrong.<br/>Please try again later.' });
    return;
  }
  toaster({ type: 'success', message: 'Successfully updated person.' });
  editModal.value = false;
  allPersons.value = await adminStore.personRead();
}
</script>

<template>
  <Head>
    <title>Persons | Admin | Larminay Vault</title>
  </Head>

  <NuxtLayout name="app">
    <main class="tw_p-1 sm:tw_px-6 sm:tw_py-4 tw_max-w-[1000px] tw_mx-auto">
      <AdminSectionHeader title="Persons">
        <q-btn
          no-caps
          unelevated
          label="New Person"
          color="primary"
          @click="
            selectedPerson = {};
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
              name: 'birthday',
              label: 'Birthday',
              field: 'birthday',
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
          :rows="allPersons"
          :wrap-cells="true"
          :rows-per-page-options="[25, 50, 100, 0]"
        >
          <template #body-cell-name="props">
            <q-td :props="props" class="tw_w-[250px]">
              {{ props.row.name }}
            </q-td>
          </template>
          <template #body-cell-birthday="props">
            <q-td :props="props" class="tw_w-[250px]">
              {{ props.row.birthday ? dayjs(props.row.birthday).format('MMM D, YYYY') : '-' }}
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
                    selectedPerson = JSON.parse(JSON.stringify(props.row));
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
                    selectedPerson = JSON.parse(JSON.stringify(props.row));
                  "
                />
              </div>
            </q-td>
          </template>

          <template #no-data>
            <div class="tw_w-full tw_text-center">
              <p class="tw_text-lg tw_italic tw_opacity-70">No persons found.</p>
            </div>
          </template>
        </q-table>
      </div>
    </main>

    <Modal v-model="editModal">
      <template #title>Edit Person</template>
      <template #body>
        <q-form greedy ref="editForm" @submit.prevent="savePerson">
          <q-input
            outlined
            no-error-icon
            v-model="selectedPerson.name"
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
            v-model="selectedPerson.birthday"
            label="Birthday"
            mask="####-##-##"
          >
            <template v-slot:append>
              <q-icon name="o_event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="selectedPerson.birthday" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
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
          @click="savePerson"
        />
      </template>
    </Modal>
    <Modal v-model="deleteModal">
      <template #title>Delete Person</template>
      <template #body>Are you sure you want to delete this person?</template>
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
