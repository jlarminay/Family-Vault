<script setup lang="ts"></script>

<template>
  <section class="tw_grid tw_grid-cols-1 tw_relative tw_overflow-hidden">
    <!-- Background Image -->
    <div
      class="tw_bg-[url('landing/topography.svg')] tw_bg-no-repeat tw_bg-cover tw_opacity-5 tw_w-full tw_h-full tw_absolute tw_inset-0"
      style="
        filter: invert(22%) sepia(76%) saturate(3727%) hue-rotate(256deg) brightness(91%)
          contrast(101%);
      "
    />

    <!-- Content -->
    <div
      class="tw_relative tw_z-10 tw_container tw_max-w-[1280px] tw_mx-auto tw_flex sm:tw_px-20 tw_py-24 md:tw_flex-row tw_flex-col tw_items-center"
    >
      <div
        class="lg:tw_flex-grow md:tw_w-1/2 lg:tw_pr-12 md:tw_pr-8 tw_flex tw_flex-col md:tw_items-start md:tw_text-left tw_mb-16 md:tw_mb-0 tw_items-center tw_text-center"
      >
        <h1 class="h1 tw_text-5xl tw_font-bold">The Larminay Vault</h1>
        <p class="h3 tw_text-2xl tw_mt-4 tw_font-bold">
          Preserving the good, the bad,
          <br class="tw_hidden lg:tw_inline-block" />
          and the ugly since 1967.
        </p>
        <q-btn
          label="Login"
          outline
          rounded
          no-caps
          size="16px"
          color="primary"
          class="tw_mt-4 tw_px-14 tw_font-bold"
          to="/login"
        />
      </div>
      <div class="lg:tw_max-w-lg lg:tw_w-full md:tw_w-1/2 tw_w-5/6">
        <LandingHeroImage />
      </div>
    </div>
  </section>
</template>

<style scoped lang="postcss"></style>
