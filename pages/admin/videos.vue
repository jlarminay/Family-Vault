<script setup lang="ts">
definePageMeta({
  middleware: 'admin-authorized-only',
});

const editForm = ref<any>(null);
const adminStore = useAdminStore();
const allVideos = ref(await adminStore.videoRead());
const selectedCollection = ref<any>(null);
const deleteModal = ref(false);
const editModal = ref(false);
const loading = ref(false);
</script>

<template>
  <Head>
    <title>Videos | Admin | Larminay Vault</title>
  </Head>

  <NuxtLayout name="app">
    <main class="tw_px-6 tw_py-4 tw_max-w-[1000px] tw_mx-auto">
      <AdminSectionHeader title="Collections" />

      <div class="tw_mt-6">
        <q-table
          flat
          :columns="[
            { name: 'title', label: 'Title', field: 'title', align: 'left', sortable: true },
            {
              name: 'createdAt',
              label: 'Created At',
              field: 'createdAt',
              align: 'left',
              sortable: true,
            },
            {
              name: 'owner',
              label: 'Owner',
              field: 'owner',
              align: 'left',
              sortable: true,
            },
            // { name: 'actions', label: '', field: 'actions', align: 'right', sortable: false },
          ]"
          :rows="allVideos"
          :wrap-cells="true"
          :rows-per-page-options="[25, 50, 100, 0]"
        >
          <template #body-cell-title="props">
            <q-td :props="props" class="tw_w-[250px]">
              <q-icon
                v-if="!props.row.published"
                name="sym_o_lock"
                class="tw_text-white tw_bg-red-600 tw_text-base tw_rounded-full tw_p-1 tw_mr-2"
              />
              <NuxtLink :to="`/video/${props.row.id}`" class="link">
                {{ props.row.title }}
              </NuxtLink>
            </q-td>
          </template>
          <template #body-cell-createdAt="props">
            <q-td :props="props">
              <div class="tw_line-clamp-1">
                {{ props.row.createdAt }}
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
