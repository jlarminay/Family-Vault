<script setup lang="ts">
const { signOut, data } = useAuth();
const search = ref('');
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
          src="/svgIcon/logo.svg"
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
      <q-btn round flat class="!tw_p-0" icon="sym_o_cloud_upload" color="dark" disabled>
        <q-tooltip>Upload (Coming Soon)</q-tooltip>
      </q-btn>
      <q-btn round flat class="!tw_p-0" icon="sym_o_notifications" color="dark" disabled>
        <q-tooltip>Notifications (Coming Soon)</q-tooltip>
      </q-btn>
      <q-btn round flat class="!tw_p-0" color="white">
        <q-avatar size="40px" class="tw_border">
          <img :src="data?.avatar" />
        </q-avatar>
        <q-menu class="tw_min-w-[140px]" :offset="[0, 4]">
          <q-list>
            <!-- <q-item clickable v-close-popup to="/profile">
              <q-item-section avatar>
                <q-icon name="sym_o_face" />
              </q-item-section>
              <q-item-section>Profile</q-item-section>
            </q-item>
            <q-separator /> -->
            <q-item clickable v-close-popup to="/legal">
              <q-item-section avatar>
                <q-icon name="sym_o_policy" />
              </q-item-section>
              <q-item-section>Legal</q-item-section>
            </q-item>
            <q-item clickable v-close-popup href="https://github.com/jlarminay/Larminay-Vault">
              <q-item-section avatar>
                <q-icon name="fa-brands fa-github" />
              </q-item-section>
              <q-item-section>GitHub</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable v-close-popup class="tw_text-red-600" @click="signOut()">
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
  @apply tw_min-w-[0px] tw_mr-0 tw_pr-2;
}
:deep(.q-item__section--avatar .q-icon) {
  @apply tw_text-xl;
}
</style>
