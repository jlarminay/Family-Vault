<script setup lang="ts">
const { data: authData } = useAuth();

const headerBg = ref(false);

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

function handleScroll() {
  if (window.scrollY > 0) {
    headerBg.value = true;
  } else {
    headerBg.value = false;
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>

<template>
  <header
    class="tw_fixed tw_w-full tw_z-[9999] tw_body-font tw_top-0 tw_bg-white tw_transition tw_duration-500 tw_ease-in-out"
    :class="{ 'tw_bg-opacity-0': !headerBg, 'tw_bg-opacity-100': headerBg }"
  >
    <div
      class="tw_container tw_mx-auto tw_flex tw_py-1 sm:tw_py-2 tw_px-1 sm:tw_px-6 tw_flex-row tw_justify-between tw_items-center"
    >
      <q-btn
        to="/"
        no-caps
        flat
        size="20px"
        class="tw_text-black tw_font-montserrat tw_font-bold"
        @click="scrollToTop"
      >
        <img src="/logo/logo.svg" class="tw_w-7 tw_mr-2" />
        Larminay Vault
      </q-btn>

      <nav class="tw_flex tw_flex-wrap tw_items-center tw_text-base tw_justify-center tw_gap-2">
        <q-btn
          v-if="$q.screen.width > 770"
          flat
          no-caps
          label="Document"
          color="primary"
          to="/document"
        />
        <q-btn
          v-if="$q.screen.width > 770"
          flat
          no-caps
          label="Github"
          color="primary"
          href="https://github.com/jlarminay/Larminay-Vault"
        />

        <q-btn
          v-if="$q.screen.width <= 770"
          flat
          no-caps
          round
          icon="o_menu"
          class="tw_text-gray-800"
        >
          <q-menu class="tw_min-w-[160px]" :offset="[0, 4]">
            <q-list>
              <q-item clickable v-ripple to="/document">
                <q-item-section>Document</q-item-section>
              </q-item>
              <q-item clickable v-ripple to="/document/legal">
                <q-item-section>Legal</q-item-section>
              </q-item>
              <q-item clickable v-ripple href="https://github.com/jlarminay/Larminay-Vault">
                <q-item-section>Github</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <q-btn
          v-if="!authData"
          unelevated
          no-caps
          label="Login"
          color="primary"
          to="/login"
          class="tw_mr-4"
        />
        <q-btn
          v-else
          unelevated
          no-caps
          :label="$q.screen.width > 500 ? 'App Dashboard' : 'Dashboard'"
          color="primary"
          to="/dashboard"
          class="tw_mr-4"
        />
      </nav>
    </div>
  </header>
</template>

<style scoped lang="postcss"></style>
