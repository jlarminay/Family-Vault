<script setup lang="ts">
const { data: authData } = useAuth();
const route = useRoute();
const menuOptions = ref([
  {
    title: 'Processing',
    pages: [
      {
        title: 'Introduction',
        code: '/document/process/introduction',
      },
    ],
  },
  {
    title: 'Legal',
    pages: [
      {
        title: 'Terms and Conditions',
        code: '/document/legal/terms-and-conditions',
      },
      {
        title: 'Privacy Policy',
        code: '/document/legal/privacy-policy',
      },
      {
        title: 'Copyright',
        code: '/document/legal/copyright',
      },
    ],
  },
]);
</script>

<template>
  <q-layout view="hHh LpR fFf">
    <q-header>
      <LandingHeader />
    </q-header>

    <q-page-container>
      <div
        class="tw_flex tw_container tw_mx-auto md:tw_px-10 tw_pt-[100px] md:tw_pt-[80px] tw_pb-10"
      >
        <div class="tw_w-1/5 tw_min-w-[250px] tw_border-r tw_p-4 tw_hidden md:tw_block">
          <div class="tw_sticky tw_top-[96px]">
            <div v-for="(section, i) in menuOptions" :key="i" class="tw_mb-4">
              <p class="tw_uppercase tw_text-gray-500 tw_font-bold tw_pb-2">{{ section.title }}</p>
              <q-btn
                v-for="option in section.pages"
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
            </div>
          </div>
        </div>
        <div class="tw_grow tw_py-4 tw_px-4 sm:tw_px-8">
          <slot name="default" />
        </div>
        <div class="tw_w-1/5 tw_min-w-[250px] tw_border-l tw_p-4 tw_hidden xl:tw_block">
          <div class="tw_sticky tw_top-[96px]">
            <p class="tw_uppercase tw_text-gray-500 tw_font-bold tw_pb-2">On This Page</p>
            <slot name="right-column" />
          </div>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<style scoped lang="postcss"></style>
