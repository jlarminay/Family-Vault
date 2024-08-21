<script setup lang="ts">
const route = useRoute();
const menuOptions = ref([
  {
    title: 'Introduction',
    code: '/process',
  },
]);
</script>

<template>
  <NuxtLayout name="documentation">
    <template #left-column>
      <p class="tw_uppercase tw_text-gray-500 tw_font-bold tw_pb-2">Process</p>
      <q-btn
        v-for="option in menuOptions"
        :key="option.code"
        flat
        unelevated
        no-caps
        class="tw_w-full"
        :color="route.path.includes(option.code) ? 'primary' : 'dark'"
        align="left"
        :label="option.title"
        :to="option.code"
      />
    </template>
    <template #default>
      <div class="tw_flex tw_items-center tw_mb-12">
        <q-btn flat round dense icon="menu" class="tw_mr-4 tw_block md:tw_hidden">
          <q-menu>
            <q-list>
              <q-item v-for="option in menuOptions" :key="option.code" clickable :to="option.code">
                <q-item-section>{{ option.title }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <h1 class="h1">
          <slot name="title" />
        </h1>
      </div>
      <slot name="default" />
    </template>
    <template #right-column>
      <p class="tw_uppercase tw_text-gray-500 tw_font-bold tw_pb-2">On This Page</p>
      <slot name="right-column" />
    </template>
  </NuxtLayout>
</template>

<style scoped lang="postcss"></style>
