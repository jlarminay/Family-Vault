<script setup lang="ts">
const { signOut, data } = useAuth();
const search = ref('');

const menuItems = ref([
  {
    label: 'My Profile',
    if: data.value?.person?.id,
    icon: 'sym_o_groups',
    to: `/people/${data.value?.person?.id}`,
  },
  { label: 'Liked Videos', icon: 'sym_o_favorite', to: '/liked' },
  { type: 'separator' },
  { label: 'All People', icon: 'sym_o_groups', to: '/people' },
  { type: 'separator' },
  { label: 'Legal', icon: 'sym_o_policy', to: '/legal' },
  { label: 'Reports', icon: 'sym_o_flag', to: '/reports' },
  { type: 'separator' },
  {
    label: 'Logout',
    icon: 'sym_o_logout',
    class: 'tw_text-red-600',
    to: '/logout',
  },
]);

function handleSearch() {
  navigateTo(`/dashboard?search=${search.value}`);
}
</script>

<template>
  <nav
    class="tw_py-2 tw_px-6 tw_border-b tw_flex tw_justify-between tw_items-center tw_sticky tw_top-0 tw_bg-white tw_z-10"
  >
    <div>
      <q-btn
        to="/dashboard"
        no-caps
        flat
        size="20px"
        class="tw_group tw_text-black tw_font-montserrat tw_font-bold"
      >
        <img
          src="/logo/logo.svg"
          class="tw_w-7 tw_mr-2 group-hover:tw_rotate-[720deg] tw_transition-transform tw_duration-1000 tw_ease-in-out"
        />
        Larminay Vault
      </q-btn>
    </div>

    <div>
      <q-input
        outlined
        rounded
        dense
        v-model="search"
        placeholder="Search..."
        class="tw_min-w-[400px] tw_pr-0"
        color="primary"
        @keyup.enter="handleSearch()"
      >
        <template v-slot:append>
          <q-btn round dense flat icon="sym_o_search" />
        </template>
      </q-input>
    </div>

    <div class="tw_flex tw_items-center tw_gap-4">
      <q-btn round flat class="!tw_p-0" icon="sym_o_cloud_upload" color="dark" disabled>
        <q-tooltip>Upload (Coming Soon)</q-tooltip>
      </q-btn>
      <!-- <q-btn round flat class="!tw_p-0" icon="sym_o_notifications" color="dark" disabled>
        <q-tooltip>Notifications (Coming Soon)</q-tooltip>
      </q-btn> -->
      <q-btn round flat class="!tw_p-0" color="white">
        <q-avatar size="40px" class="tw_border">
          <img :src="data?.avatar" />
        </q-avatar>

        <!-- Dropdown Menu -->
        <q-menu class="tw_min-w-[160px]" :offset="[0, 4]">
          <q-list>
            <span v-for="(item, i) in menuItems" :key="i">
              <span v-if="item.if || true">
                <q-separator v-if="item.type === 'separator'" />
                <q-item
                  v-else
                  clickable
                  v-close-popup
                  :class="item.class || ''"
                  :to="item.to || ''"
                >
                  <q-item-section avatar>
                    <q-icon :name="item.icon" />
                  </q-item-section>
                  <q-item-section>{{ item.label }}</q-item-section>
                </q-item>
              </span>
            </span>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
  </nav>
</template>

<style scoped lang="postcss">
:deep(.q-item__section--avatar) {
  @apply tw_min-w-[0px] tw_mr-0 tw_pr-2;
}
:deep(.q-item__section--avatar .q-icon) {
  @apply tw_text-xl;
}
</style>
