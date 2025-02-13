<script setup lang="ts">
const { signIn } = useAuth();
definePageMeta({
  middleware: 'unauthorized-only',
});

const showLegalModal = ref(false);
const initialLegalState = ref('');

onMounted(() => {
  if (window.location.search.includes('state=error')) {
    toaster({
      type: 'error',
      message: "You don't have permission to access the site.",
      duration: false,
    });
  }
});
</script>

<template>
  <Head>
    <title>Login | Larminay Vault</title>
  </Head>

  <div>
    <main
      class="tw_flex tw_justify-center tw_items-center tw_h-[100svh] tw_bg-gradient-to-tr tw_from-primary tw_to-secondary"
    >
      <div
        class="tw_relative tw_bg-white tw_p-8 sm:tw_p-12 tw_rounded-lg tw_w-[450px] tw_max-w-[90%] tw_text-center"
      >
        <q-btn
          v-if="!$pwa?.isPWAInstalled"
          round
          flat
          class="tw_absolute tw_top-4 tw_left-4"
          icon="o_arrow_back"
          to="/"
        />
        <p class="tw_mb-4 tw_px-8 tw_pb-2 tw_text-3xl tw_border-b tw_border-b-dark tw_inline-block">
          Login
        </p>
        <p class="tw_mb-4">
          This app is invite only, you can request access from
          <a class="link" href="mailto:j.larminay@gmail.com">j.larminay@gmail.com</a>
        </p>
        <div class="tw_flex tw_flex-col tw_gap-2">
          <LoginButtonTesting v-if="isOnTestingServer()" />
          <q-btn
            v-for="provider in [
              { name: 'Google', bgColor: 'tw_bg-[#4285F4]' },
              { name: 'Spotify', bgColor: 'tw_bg-[#179443]' },
              { name: 'GitHub', bgColor: 'tw_bg-[#24292e]' },
              { name: 'Discord', bgColor: 'tw_bg-[#7289da]' },
            ]"
            no-caps
            unelevated
            size="18px"
            @click="signIn(provider.name.toLowerCase(), { email: 'test', password: 'test' })"
            class="tw_text-white"
            :class="`${provider.bgColor}`"
          >
            <q-icon
              :name="`fa-brands fa-${provider.name.toLowerCase()}`"
              size="sm"
              class="tw_mr-2"
            />
            Login with {{ provider.name }}
          </q-btn>
          <p class="tw_mt-4">
            By using the app, you agree to the
            <br />
            <span
              class="link"
              @click="
                initialLegalState = 'Privacy Policy';
                showLegalModal = true;
              "
            >
              Privacy Policy
            </span>
            and
            <span
              class="link"
              @click="
                initialLegalState = 'Terms and Conditions';
                showLegalModal = true;
              "
            >
              Terms and Conditions </span
            >.
          </p>
        </div>
      </div>
    </main>

    <LegalModal v-model="showLegalModal" :initialState="initialLegalState" />
  </div>
</template>

<style scoped lang="postcss"></style>
