<script setup lang="ts">
import validator from 'validator';
const { data: authData } = useAuth();
definePageMeta({
  middleware: 'authorized-only',
});

const editForm = ref<any>(null);
const userStore = useUserStore();
const allUsers = ref(await userStore.getAll());
const selectedUser = ref<any>(null);
const deleteModal = ref(false);
const editModal = ref(false);
const loading = ref(false);

async function confirmDelete() {
  loading.value = true;
  let response = await userStore.delete(selectedUser.value.id);
  loading.value = false;
  if (!response) {
    toaster({ type: 'error', message: 'Something went wrong.<br/>Please try again later.' });
    return;
  }
  toaster({ type: 'success', message: 'Successfully deleted user.' });
  deleteModal.value = false;
  allUsers.value = await userStore.getAll();
}
async function saveUser() {
  if (!(await editForm.value.validate())) return;
  loading.value = true;
  let response = await userStore.createOrUpdate(selectedUser.value);
  loading.value = false;
  if (!response) {
    toaster({ type: 'error', message: 'Something went wrong.<br/>Please try again later.' });
    return;
  }
  toaster({ type: 'success', message: 'Successfully updated user.' });
  editModal.value = false;
  allUsers.value = await userStore.getAll();
}
</script>

<template>
  <Head>
    <title>Users | Larminay Vault</title>
  </Head>

  <div>
    <SingleNavMenu />

    <main class="tw_px-6 tw_py-4 tw_max-w-[1000px] tw_mx-auto">
      <div class="tw_flex tw_justify-between tw_items-center">
        <h1 class="h1">Users</h1>
        <q-btn
          no-caps
          unelevated
          label="New User"
          color="primary"
          class="tw_mt-4"
          @click="
            selectedUser = {};
            editModal = true;
          "
        />
      </div>
      <div class="tw_mt-6">
        <q-table
          flat
          :columns="[
            { name: 'icons', label: '', field: 'icons', align: 'left', sortable: false },
            { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
            { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true },
            {
              name: 'lastLogin',
              label: 'Last Login',
              field: 'lastLogin',
              align: 'left',
              sortable: true,
            },
            { name: 'actions', label: '', field: 'actions', align: 'right', sortable: false },
          ]"
          :rows="allUsers"
          :wrap-cells="true"
          :rows-per-page-options="[25, 50, 100, 0]"
        >
          <template #body-cell-icons="props">
            <q-td :props="props">
              <div class="tw_flex tw_gap-2 tw_items-center">
                <q-icon
                  :name="`fa-brands fa-${props.row.provider}`"
                  class="tw_text-xl"
                  :class="{
                    'tw_text-[#24292e]': props.row.provider === 'github',
                    'tw_text-[#7289da]': props.row.provider === 'discord',
                    'tw_text-[#4285F4]': props.row.provider === 'google',
                  }"
                />
                <q-icon
                  :name="`sym_o_${props.row.active ? 'check_circle' : 'cancel'}`"
                  class="tw_text-2xl"
                  :class="{
                    'tw_text-green-600': props.row.active,
                    'tw_text-red-600': !props.row.active,
                  }"
                />
              </div>
            </q-td>
          </template>
          <template #body-cell-name="props">
            <q-td :props="props">
              <div class="tw_flex tw_gap-2 tw_items-center">
                <img
                  :src="props.row.avatar || 'https://placehold.it/150'"
                  class="tw_w-8 tw_h-8 tw_rounded-full"
                />
                {{ props.row.name }}
              </div>
            </q-td>
          </template>
          <template #body-cell-email="props">
            <q-td :props="props">
              {{ props.row.email }}
            </q-td>
          </template>
          <template #body-cell-lastLogin="props">
            <q-td :props="props">
              {{
                props.row.lastLogin
                  ? $dayjs(props.row.lastLogin).format('MMM D, YYYY h:mm A')
                  : 'Never'
              }}
            </q-td>
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
                    selectedUser = JSON.parse(JSON.stringify(props.row));
                  "
                />
              </div>
            </q-td>
          </template>

          <template #no-data>
            <div class="tw_w-full tw_text-center">
              <p class="tw_text-lg tw_italic tw_opacity-70">No users found.</p>
            </div>
          </template>
        </q-table>
      </div>
    </main>

    <Modal v-model="editModal">
      <template #title>Edit User</template>
      <template #body>
        <q-form greedy ref="editForm" @submit.prevent="saveUser">
          <q-input
            outlined
            no-error-icon
            v-model="selectedUser.name"
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
            v-model="selectedUser.email"
            label="Email"
            maxlength="128"
            autogrow
            counter
            required
            :rules="[
              (val: string) => !!val || 'Required',
              (val: string) => validator.isEmail(val) || 'Invalid email',
              (val: string) => val.length <= 128 || 'Max 128 characters',
            ]"
          />
          <q-select
            behavior="menu"
            outlined
            no-error-icon
            v-model="selectedUser.provider"
            label="Provider"
            emit-value
            map-options
            :options="[
              { label: 'Github', value: 'github' },
              { label: 'Discord', value: 'discord' },
              { label: 'Google', value: 'google' },
            ]"
            required
            :rules="[(val: string) => !!val || 'Required']"
          />
          <q-checkbox
            v-if="!!selectedUser.id && selectedUser.id !== authData?.id"
            v-model="selectedUser.active"
            :label="selectedUser.active ? 'Active user' : 'Inactive User'"
            class="tw_mt-[-0.5rem]"
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
          @click="saveUser"
        />
      </template>
    </Modal>
    <Modal v-model="deleteModal">
      <template #title>Delete User</template>
      <template #body>Are you sure you want to delete this user?</template>
      <template #actions>
        <q-btn outline unelevated no-caps rounded label="Cancel" color="dark" v-close-popup />
        <q-btn
          no-caps
          rounded
          unelevated
          label="Confirm Delete"
          color="primary"
          :loading="loading"
          @click="confirmDelete"
        />
      </template>
    </Modal>
  </div>
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
