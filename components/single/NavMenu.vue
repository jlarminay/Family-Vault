<script setup lang="ts">
const { data: authData } = useAuth();
const route = useRoute();

const search = ref<string>('');
const showSearchInput = ref(false);
const showLegalModal = ref(false);

watch(
  () => route.query.search,
  (value) => {
    search.value = value as string;
  },
  { immediate: true },
);

function handleSearch() {
  if (search.value === '') return navigateTo('/dashboard');
  navigateTo(`/dashboard?search=${search.value}`);
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>

<template>
  <nav
    class="tw_py-1 sm:tw_py-2 tw_px-1 sm:tw_px-2 tw_border-b tw_sticky tw_top-0 tw_bg-white tw_z-10"
  >
    <div class="tw_container tw_mx-auto tw_flex tw_justify-between tw_items-center tw_h-[52px]">
      <!-- Logo -->
      <div class="sm:tw_min-w-[250px]">
        <q-btn
          to="/dashboard"
          no-caps
          flat
          size="20px"
          class="tw_group tw_text-black tw_font-montserrat tw_font-bold"
          @click="scrollToTop"
        >
          <img
            src="/logo.svg"
            class="tw_w-7 tw_mr-2 group-hover:tw_rotate-[720deg] tw_transition-transform tw_duration-1000 tw_ease-in-out"
          />
          Larminay Vault
        </q-btn>
      </div>

      <!-- Search Input -->
      <div v-if="$q.screen.gt.sm">
        <q-input
          outlined
          rounded
          dense
          v-model="search"
          placeholder="Search..."
          class="tw_min-w-[350px] tw_pr-0"
          color="primary"
          @keyup.enter="handleSearch()"
        >
          <template v-slot:append>
            <q-btn
              v-if="!!search"
              round
              dense
              flat
              icon="o_close"
              @click="
                search = '';
                handleSearch();
              "
            />
          </template>
          <template v-slot:prepend>
            <q-btn round dense flat icon="o_search" @click="handleSearch" />
          </template>
        </q-input>
      </div>

      <!-- Right buttons -->
      <div class="tw_flex tw_items-center tw_justify-end tw_gap-4 sm:tw_min-w-[250px] tw_pr-4">
        <q-btn
          v-if="$q.screen.lt.md"
          round
          flat
          class="!tw_p-0"
          icon="o_search"
          color="dark"
          @click="showSearchInput = !showSearchInput"
        />

        <q-btn round flat class="!tw_p-0" color="white">
          <div class="tw_w-[40px] tw_aspect-square tw_rounded-full tw_overflow-hidden tw_border">
            <img :src="authData?.avatar" class="tw_w-full" />
          </div>

          <!-- Dropdown Menu -->
          <q-menu class="tw_min-w-[160px]" :offset="[0, 4]">
            <q-list>
              <div v-if="!$pwa?.isPWAInstalled">
                <q-item clickable v-close-popup to="/">
                  <q-item-section avatar>
                    <q-icon name="o_house" />
                  </q-item-section>
                  <q-item-section>Home</q-item-section>
                </q-item>
                <SingleInstallButton />
                <q-separator />
              </div>
              <q-item clickable v-close-popup to="/account">
                <q-item-section avatar>
                  <q-icon name="o_face" />
                </q-item-section>
                <q-item-section>My Profile</q-item-section>
              </q-item>
              <q-item v-if="authData?.role === 'admin'" clickable v-close-popup to="/admin">
                <q-item-section avatar>
                  <q-icon name="o_admin_panel_settings" />
                </q-item-section>
                <q-item-section>Admin</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup to="/stats">
                <q-item-section avatar>
                  <q-icon name="o_query_stats" />
                </q-item-section>
                <q-item-section>Stats</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/family">
                <q-item-section avatar>
                  <q-icon name="o_park" />
                </q-item-section>
                <q-item-section>Family Tree</q-item-section>
              </q-item>
              <q-item
                clickable
                v-close-popup
                target="_blank"
                href="https://quixotic-smile-9bb.notion.site/Larminay-Vault-824520c770384583969e8ccb188bc6b5"
              >
                <q-item-section avatar>
                  <q-icon name="o_description" />
                </q-item-section>
                <q-item-section>Documents</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="showLegalModal = true">
                <q-item-section avatar>
                  <q-icon name="o_policy" />
                </q-item-section>
                <q-item-section>Legal</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/logout" class="tw_text-red-600">
                <q-item-section avatar>
                  <q-icon name="o_logout" />
                </q-item-section>
                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </div>

    <div
      v-if="showSearchInput"
      class="tw_flex tw_gap-4 tw_justify-between tw_items-center tw_h-[52px] tw_mr-4 tw_ml-2"
    >
      <q-btn
        round
        flat
        class="!tw_p-0"
        icon="o_arrow_back"
        color="dark"
        @click="showSearchInput = !showSearchInput"
      />
      <q-input
        outlined
        rounded
        dense
        v-model="search"
        placeholder="Search..."
        class="tw_w-full tw_pr-0"
        color="primary"
        @keyup.enter="handleSearch"
      >
        <template v-slot:append>
          <q-btn
            v-if="!!search"
            round
            dense
            flat
            icon="o_close"
            @click="
              search = '';
              handleSearch();
            "
          />
        </template>
        <template v-slot:prepend>
          <q-btn round dense flat icon="o_search" @click="handleSearch" />
        </template>
      </q-input>
    </div>
  </nav>

  <LegalModal v-model="showLegalModal" />
</template>

<style scoped lang="postcss">
:deep(.q-item__section--avatar) {
  @apply tw_min-w-[0px] tw_mr-0 tw_pr-2;
}
:deep(.q-item__section--avatar .q-icon) {
  @apply tw_text-xl;
}
</style>
