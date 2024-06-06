<script setup lang="ts">
const emits = defineEmits(['hideFilterMenu']);
const props = defineProps({
  showFilterMenu: {
    type: Boolean,
    required: false,
    default: false,
  },
});
const leftDrawerOpen = ref(false);

watch(
  () => props.showFilterMenu,
  (val) => {
    leftDrawerOpen.value = val;
  },
);
</script>

<template>
  <q-layout view="hHh LpR fFf">
    <q-header>
      <SingleNavMenu />
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" bordered @hide="emits('hideFilterMenu')">
      <slot name="sidemenu" />
    </q-drawer>

    <q-page-container>
      <slot name="default" />
    </q-page-container>
  </q-layout>
</template>

<style scoped lang="postcss"></style>
