<script setup lang="ts">
const route = useRoute();
</script>

<template>
  <NuxtLayout name="documentation">
    <template #left-column>
      <p class="tw_uppercase tw_text-gray-500 tw_font-bold tw_pb-2">Legal</p>
      <q-btn
        v-for="option in [
          {
            title: 'Terms and Conditions',
            code: 'terms-and-conditions',
          },
          {
            title: 'Privacy Policy',
            code: 'privacy-policy',
          },
          {
            title: 'Copyright',
            code: 'copyright',
          },
        ]"
        :key="option.code"
        flat
        unelevated
        no-caps
        class="tw_w-full"
        :color="route.path.includes(option.code) ? 'primary' : 'dark'"
        align="left"
        :label="option.title"
        :to="`/legal/${option.code}`"
      />
    </template>
    <template #default>
      <slot name="default" />
    </template>
    <template #right-column>
      <p class="tw_uppercase tw_text-gray-500 tw_font-bold tw_pb-2">On This Page</p>
      <slot name="right-column" />
    </template>
  </NuxtLayout>
</template>

<style scoped lang="postcss"></style>
