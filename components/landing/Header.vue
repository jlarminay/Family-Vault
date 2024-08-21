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
      class="tw_container tw_mx-auto tw_flex tw_flex-wrap tw_py-1 sm:tw_py-2 tw_px-1 sm:tw_px-6 tw_flex-col md:tw_flex-row tw_items-center"
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
      <nav
        class="md:tw_ml-auto tw_flex tw_flex-wrap tw_items-center tw_text-base tw_justify-center tw_gap-2"
      >
        <q-btn flat no-caps label="Process" color="primary" to="/process" />
        <q-btn flat no-caps label="Legal" color="primary" to="/legal/terms-and-conditions" />
        <q-btn
          flat
          no-caps
          label="Github"
          color="primary"
          href="https://github.com/jlarminay/Larminay-Vault"
        />
        <q-btn v-if="!authData" unelevated no-caps label="Login" color="primary" to="/login" />
        <q-btn v-else unelevated no-caps label="App Dashboard" color="primary" to="/dashboard" />
      </nav>
    </div>
  </header>
</template>

<style scoped lang="postcss"></style>
