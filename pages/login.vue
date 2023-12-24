<script setup lang="ts">
const { signIn, signOut, status, data } = useAuth();
definePageMeta({
  title: 'Login',
  middleware: 'unauthorized-only',
});
</script>

<template>
  <div
    class="tw_flex tw_justify-center tw_items-center tw_h-[100svh] tw_bg-gradient-to-tr tw_from-primary tw_to-secondary"
  >
    <div class="tw_relative tw_bg-white tw_p-12 tw_rounded-lg tw_w-[450px] tw_text-center">
      <q-btn round flat class="tw_absolute tw_top-4 tw_left-4" icon="sym_o_arrow_back" to="/" />
      <p class="tw_mb-8 tw_px-8 tw_pb-2 tw_text-3xl tw_border-b tw_border-b-dark tw_inline-block">
        Login
      </p>
      <div class="tw_flex tw_flex-col tw_gap-4">
        <q-btn
          rounded
          no-caps
          unelevated
          size="18px"
          @click="signIn('github')"
          class="tw_bg-[#24292e] tw_text-white"
        >
          <q-img src="/svgIcon/github.svg" class="tw_w-6 tw_mr-2" />
          Login with GitHub
        </q-btn>
        <q-btn
          rounded
          no-caps
          unelevated
          size="18px"
          @click="signIn('discord')"
          class="tw_bg-[#7289da] tw_text-white"
        >
          <q-img src="/svgIcon/discord.svg" class="tw_w-6 tw_mr-2" />
          Login With Discord
        </q-btn>
        <p>
          Request access from
          <a class="link" href="mailto:j.larminay@gmail.com">j.larminay@gmail.com</a>
        </p>
      </div>
    </div>
  </div>
  <div class="tw_p-4">
    <q-btn label="Back" to="/" />
    <h1 class="tw_text-2xl tw_mb-2">This is the login page</h1>
    <p>You are not logged in.</p>
    <pre>{{ status }}</pre>
    <pre>{{ data }}</pre>
    <div></div>
    <q-btn rounded no-caps unelevated outline @click="signOut()">Sign Out</q-btn>
  </div>
</template>

<style scoped lang="postcss"></style>
