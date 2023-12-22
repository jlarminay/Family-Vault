<script setup lang="ts">
definePageMeta({
  title: 'Home',
});

const config = useRuntimeConfig().public;
const testStore = useTestStore();

const greetings = await testStore.getHello();
</script>

<template>
  <div>
    <NavMenu />

    <div class="tw_p-4">
      <h1 class="tw_text-2xl tw_mb-6">Hello World</h1>

      <div class="tw_p-4 tw_inline-block tw_border tw_text-center">
        <p v-if="testStore.getCount > 5" class="tw_text-red-700">TOO MUCH</p>
        <p class="tw_text-lg">{{ testStore.getCount }}</p>
        <div class="tw_flex tw_gap-2">
          <q-btn @click="testStore.increment(1)" :disabled="testStore.getCount >= 10">
            Increment
          </q-btn>
          <q-btn @click="testStore.decrement(1)" :disabled="testStore.getCount <= 0">
            Decrement
          </q-btn>
        </div>
      </div>

      <div class="tw_mt-10 tw_p-4 tw_border">
        {{ greetings }}
        <pre>{{ config }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
