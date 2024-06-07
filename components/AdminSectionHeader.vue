<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: false,
    default: '',
  },
});
</script>

<template>
  <div class="tw_mb-6">
    <div class="tw_flex tw_justify-between tw_items-center">
      <h1 class="h1">Admin {{ title ? ` / ${title}` : '' }}</h1>
      <div>
        <slot />
      </div>
    </div>
    <div class="tw_mt-6">
      <div class="tw_flex tw_gap-2">
        <q-btn no-caps outline to="/admin" label="Dashboard" />
        <q-btn no-caps outline to="/admin/settings" label="Settings" />
        <q-btn no-caps outline to="/admin/videos" label="Videos" />
        <q-btn no-caps outline to="/admin/users" label="Users" />
        <q-btn no-caps outline to="/admin/reports" label="Reports" />
        <q-btn no-caps outline to="/admin/collections" label="Collections" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
