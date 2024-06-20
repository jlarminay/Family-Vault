<script setup lang="ts">
const { data: authData } = useAuth();
</script>

<template>
  <q-layout view="hHh LpR fFf">
    <q-header v-if="authData">
      <SingleNavMenu />
    </q-header>

    <q-page-container>
      <slot name="default" />
    </q-page-container>
  </q-layout>
</template>

<style scoped lang="postcss"></style>
