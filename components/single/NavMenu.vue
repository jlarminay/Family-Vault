<script setup lang="ts">
const search = ref('');
</script>

<template>
  <nav
    class="tw_py-2 tw_px-6 tw_border-b tw_flex tw_justify-between tw_items-center tw_sticky tw_top-0 tw_bg-white tw_z-10"
  >
    <div>
      <NuxtLink
        to="/dashboard"
        class="tw_px-4 tw_py-2 tw_rounded-md tw_bg-primary tw_text-white tw_text-lg hover:tw_opacity-80 tw_transition-opacity tw_duration-300"
      >
        <q-icon name="sym_o_movie" />
        Larminay Vault
      </NuxtLink>
    </div>

    <div>
      <q-input
        outlined
        rounded
        dense
        v-model="search"
        placeholder="Search.."
        class="tw_min-w-[400px] tw_pr-0"
        color="primary"
      >
        <template v-slot:append>
          <q-btn round dense flat icon="sym_o_search" />
        </template>
      </q-input>
    </div>

    <div class="tw_flex tw_items-center tw_gap-4">
      <q-btn rounded no-caps unelevated outline to="/login">
        <q-icon name="sym_o_face" class="tw_mr-1" />
        Sign In
      </q-btn>

      <q-btn round flat class="!tw_p-0" color="white">
        <q-avatar size="40px">
          <img src="https://cdn.quasar.dev/img/avatar.png" />
        </q-avatar>
        <q-menu>
          <q-list>
            <q-item clickable v-close-popup to="/profile">
              <q-item-section avatar>
                <q-icon name="sym_o_face" />
              </q-item-section>
              <q-item-section>Profile</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable v-close-popup to="/dashboard">
              <q-item-section>Dashboard</q-item-section>
            </q-item>
            <q-item clickable v-close-popup to="/video/0">
              <q-item-section>Video</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable v-close-popup to="/profile">
              <q-item-section avatar>
                <q-icon name="sym_o_policy" />
              </q-item-section>
              <q-item-section>Legal</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable v-close-popup class="tw_text-red-600">
              <q-item-section avatar>
                <q-icon name="sym_o_logout" />
              </q-item-section>
              <q-item-section>Logout</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
  </nav>
</template>

<style scoped lang="postcss">
:deep(.q-item__section--avatar) {
  min-width: 0;
  padding-right: 8px;
}
:deep(.q-item__section--avatar .q-icon) {
  font-size: 20px;
}
</style>
