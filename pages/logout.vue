<script setup lang="ts">
const { signOut } = useAuth();
definePageMeta({
  middleware: 'authorized-only',
});

signOut();
</script>

<template>
  <Head>
    <title>Logout | Larminay Vault</title>
  </Head>
</template>

<style scoped lang="postcss"></style>
