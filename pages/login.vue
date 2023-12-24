<script setup lang="ts">
const { signIn, signOut, status, data } = useAuth();
definePageMeta({
  title: 'Login',
  middleware: 'unauthorized-only',
});
</script>

<template>
  <div class="tw_p-4">
    <q-btn label="Back" to="/" />
    <h1 class="tw_text-2xl tw_mb-2">This is the login page</h1>
    <p>You are not logged in.</p>
    <pre>{{ status }}</pre>
    <pre>{{ data }}</pre>
    <div class="tw_flex tw_gap-2 tw_my-4">
      <q-btn rounded no-caps unelevated outline @click="signIn('github')">Sign In Github</q-btn>
      <q-btn rounded no-caps unelevated outline @click="signIn('discord')">Sign In Discord</q-btn>
    </div>
    <q-btn rounded no-caps unelevated outline @click="signOut()">Sign Out</q-btn>
  </div>
</template>

<style scoped lang="postcss"></style>
