<script setup lang="ts">
import validator from 'validator';
import dayjs from 'dayjs';

const { data: authData } = useAuth();
definePageMeta({
  middleware: 'admin-authorized-only',
});

const editForm = ref<any>(null);
const adminStore = useAdminStore();
const allUsers = ref(await adminStore.userRead());
const selectedUser = ref<any>(null);
const editModal = ref(false);
const loading = ref(false);

async function saveUser() {
  if (!(await editForm.value.validate())) return;
  loading.value = true;
  let response;
  if (!selectedUser.value.id) response = await adminStore.userCreate(selectedUser.value);
  else response = await adminStore.userUpdate(selectedUser.value);
  loading.value = false;

  if (!response) {
    toaster({ type: 'error', message: 'Something went wrong.<br/>Please try again later.' });
    return;
  }
  toaster({ type: 'success', message: 'Successfully updated user.' });
  editModal.value = false;
  allUsers.value = await adminStore.userRead();
}
</script>

<template>
  <Head>
    <title>Users | Admin | Larminay Vault</title>
  </Head>

  <NuxtLayout name="app">
    <main class="tw_p-1 sm:tw_px-6 sm:tw_py-4 tw_max-w-[1000px] tw_mx-auto">
      <AdminSectionHeader title="User">
        <q-btn
          no-caps
          unelevated
          label="New User"
          color="primary"
          @click="
            selectedUser = {};
            editModal = true;
          "
        />
      </AdminSectionHeader>

      <div class="tw_mt-6">
        <q-table
          flat
          :columns="[
            { name: 'icons', label: '', field: 'icons', align: 'left', sortable: false },
            { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
            { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true },
            { name: 'role', label: 'Role', field: 'role', align: 'left', sortable: true },
            { name: 'views', label: 'Views', field: 'views', align: 'left', sortable: true },
            {
              name: 'lastActive',
              label: 'Last Active',
              field: 'lastActive',
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
                    'tw_text-[#179443]': props.row.provider === 'spotify',
                    'tw_text-[#4285F4]': props.row.provider === 'google',
                  }"
                />
                <q-icon
                  :name="`o_${props.row.active ? 'check_circle' : 'cancel'}`"
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
          <template #body-cell-role="props">
            <q-td :props="props">
              {{ props.row.role.charAt(0).toUpperCase() + props.row.role.slice(1) }}
            </q-td>
          </template>
          <template #body-cell-views="props">
            <q-td :props="props">{{ props.row.views }} views</q-td>
          </template>
          <template #body-cell-lastActive="props">
            <q-td :props="props">
              {{
                props.row.lastActive
                  ? dayjs(props.row.lastActive).format('MMM D, YYYY h:mm A')
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
                  icon="o_edit"
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
              { label: 'Spotify', value: 'spotify' },
              { label: 'Google', value: 'google' },
            ]"
            required
            :rules="[(val: string) => !!val || 'Required']"
          />
          <q-select
            behavior="menu"
            outlined
            no-error-icon
            v-model="selectedUser.role"
            label="User Role"
            emit-value
            map-options
            :options="[
              { label: 'User', value: 'user' },
              { label: 'Admin', value: 'admin' },
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
  </NuxtLayout>
</template>

<style scoped lang="postcss"></style>
