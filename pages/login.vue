<script setup lang="ts">
const { signIn } = useAuth();
definePageMeta({
  middleware: 'unauthorized-only',
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
        <q-btn round flat class="tw_absolute tw_top-4 tw_left-4" icon="sym_o_arrow_back" to="/" />
        <p class="tw_mb-8 tw_px-8 tw_pb-2 tw_text-3xl tw_border-b tw_border-b-dark tw_inline-block">
          Login
        </p>
        <div class="tw_flex tw_flex-col tw_gap-2">
          <q-btn
            v-for="provider in [
              { name: 'Google', bgColor: 'tw_bg-[#4285F4]' },
              { name: 'GitHub', bgColor: 'tw_bg-[#24292e]' },
              { name: 'Discord', bgColor: 'tw_bg-[#7289da]' },
            ]"
            no-caps
            unelevated
            size="18px"
            @click="signIn(provider.name.toLowerCase())"
            :class="`${provider.bgColor} tw_text-white`"
          >
            <q-icon
              :name="`fa-brands fa-${provider.name.toLowerCase()}`"
              size="sm"
              class="tw_mr-2"
            />
            Login with {{ provider.name }}
          </q-btn>
          <p class="tw_mt-2">
            Request access from
            <a class="link" href="mailto:j.larminay@gmail.com">j.larminay@gmail.com</a>
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped lang="postcss"></style>
