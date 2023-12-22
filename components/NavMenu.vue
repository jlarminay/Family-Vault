<script setup lang="ts"></script>

<template>
  <nav class="tw_border-b tw_flex tw_justify-between tw_items-center">
    <div>
      <NuxtLink to="/home">Home</NuxtLink>
    </div>
    <div class="tw_flex tw_items-center tw_gap-4">
      <NuxtLink to="/login">Login</NuxtLink>
    </div>
  </nav>
</template>

<style scoped lang="postcss">
nav {
  a,
  button {
    @apply tw_p-4 tw_inline-block;
    &:hover {
      @apply tw_bg-gray-200;
    }
  }
}
</style>
