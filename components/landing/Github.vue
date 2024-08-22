<script setup lang="ts"></script>

<template>
  <section class="tw_relative tw_text-gray-600 tw_body-font">
    <div
      class="tw_relative tw_z-[1] tw_container tw_px-5 tw_py-24 tw_mx-auto tw_text-center tw_w-2/3"
    >
      <h2 class="h1 tw_mb-4">Github</h2>
      <p class="tw_text-xl">
        The source code for the Larminay Vault is available on Github. Feel free to clone the
        repository and make any changes you see fit. If you have any questions or need help, please
        reach out to me on Github or by email.
      </p>
      <q-btn
        label="View on Github"
        color="primary"
        unelevated
        no-caps
        href="https://github.com/jlarminay/Larminay-Vault"
        class="tw_my-4"
      />
    </div>
    <div
      class="tw_absolute tw_w-full tw_h-full tw_flex tw_items-center tw_justify-center tw_top-0 tw_z-[0] tw_overflow-hidden"
    >
      <img
        src="/landing/github.svg"
        alt="Github"
        class="bounce tw_w-[200px] sm:tw_w-[300px] tw_scale-[1] tw_opacity-40 sm:tw_opacity-60 tw_mr-[40%]"
      />
      <div
        class="circular tw_absolute tw_w-[200px] sm:tw_w-[300px] tw_h-[300px] tw_scale-[4] tw_opacity-10 sm:tw_opacity-20 tw_z-[-1] tw_mr-[40%]"
      />
    </div>
  </section>
</template>

<style scoped lang="postcss">
.circular {
  background: rgb(131, 61, 235);
  background: radial-gradient(circle, rgba(131, 61, 235, 1) 0%, rgba(131, 61, 235, 0) 50%);
}
.bounce {
  animation: bounce 10s infinite ease-in-out;
}
@keyframes bounce {
  0% {
    transform: translateY(-10px);
  }
  50% {
    transform: translateY(10px);
  }
  100% {
    transform: translateY(-10px);
  }
}
</style>
