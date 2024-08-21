<script setup lang="ts">
const { data: authData } = useAuth();
</script>

<template>
  <q-layout view="hHh LpR fFf">
    <q-header>
      <LandingHeader />
    </q-header>

    <q-page-container>
      <div
        class="tw_flex tw_container tw_mx-auto md:tw_px-10 tw_pt-[120px] md:tw_pt-[80px] tw_pb-10"
      >
        <div class="tw_w-1/5 tw_min-w-[250px] tw_border-r tw_p-4 tw_hidden md:tw_block">
          <div class="tw_sticky tw_top-[96px]">
            <slot name="left-column" />
          </div>
        </div>
        <div class="tw_grow tw_py-4 tw_px-4 sm:tw_px-8">
          <slot name="default" />
        </div>
        <div class="tw_w-1/5 tw_min-w-[250px] tw_border-l tw_p-4 tw_hidden xl:tw_block">
          <div class="tw_sticky tw_top-[96px]">
            <slot name="right-column" />
          </div>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<style scoped lang="postcss"></style>
