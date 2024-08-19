<script setup lang="ts"></script>

<template>
  <section class="tw_text-gray-600 tw_body-font">
    <div class="tw_container tw_px-5 tw_py-24 tw_mx-auto">
      <!-- Web App -->
      <div
        class="tw_flex tw_items-center lg:tw_w-3/5 tw_mx-auto tw_pb-14 tw_mb-14 sm:tw_flex-row tw_flex-col"
      >
        <div
          class="sm:tw_w-32 sm:tw_h-32 tw_h-20 tw_w-20 sm:tw_mr-10 tw_inline-flex tw_items-center tw_justify-center tw_rounded-full tw_bg-indigo-100 tw_text-indigo-500 tw_flex-shrink-0"
        >
          <svg
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            class="sm:tw_w-16 sm:tw_h-16 tw_w-10 tw_h-10"
            viewBox="0 0 24 24"
            data-darkreader-inline-stroke=""
            style="--darkreader-inline-stroke: currentColor"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
        </div>
        <div class="tw_flex-grow sm:tw_text-left tw_text-center tw_mt-6 sm:tw_mt-0">
          <h2 class="h1">Web App</h2>
          <p class="tw_text-lg">
            Built with Nuxt.js, the web app is a full-stack application that allows users to access
            a huge collection of photos and videos from any device. The app is designed to be
            responsive, user-friendly. and highly accessible.
          </p>
        </div>
      </div>

      <!-- Photo Gallery -->
      <div
        class="tw_flex tw_items-center lg:tw_w-3/5 tw_mx-auto tw_pb-14 tw_mb-14 sm:tw_flex-row tw_flex-col"
      >
        <div class="tw_flex-grow sm:tw_text-left tw_text-center tw_mt-6 sm:tw_mt-0">
          <h2 class="h1">Photo Gallery</h2>
          <p class="tw_text-lg">
            Running on a Raspberry Pi, the photo gallery is a self-hosted solution that auto pulls
            images from the server to ensure the latest content is always available. This desk sized
            device is perfect for displaying photos in your home or office.
          </p>
        </div>
        <div
          class="sm:tw_w-32 sm:tw_order-none tw_order-first sm:tw_h-32 tw_h-20 tw_w-20 sm:tw_ml-10 tw_inline-flex tw_items-center tw_justify-center tw_rounded-full tw_bg-indigo-100 tw_text-indigo-500 tw_flex-shrink-0"
        >
          <svg
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            class="sm:tw_w-16 sm:tw_h-16 tw_w-10 tw_h-10"
            viewBox="0 0 24 24"
            data-darkreader-inline-stroke=""
            style="--darkreader-inline-stroke: currentColor"
          >
            <circle cx="6" cy="6" r="3"></circle>
            <circle cx="6" cy="18" r="3"></circle>
            <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
          </svg>
        </div>
      </div>

      <!-- Process -->
      <div class="tw_flex tw_items-center lg:tw_w-3/5 tw_mx-auto sm:tw_flex-row tw_flex-col">
        <div
          class="sm:tw_w-32 sm:tw_h-32 tw_h-20 tw_w-20 sm:tw_mr-10 tw_inline-flex tw_items-center tw_justify-center tw_rounded-full tw_bg-indigo-100 tw_text-indigo-500 tw_flex-shrink-0"
        >
          <svg
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            class="sm:tw_w-16 sm:tw_h-16 tw_w-10 tw_h-10"
            viewBox="0 0 24 24"
            data-darkreader-inline-stroke=""
            style="--darkreader-inline-stroke: currentColor"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
        </div>
        <div class="tw_flex-grow sm:tw_text-left tw_text-center tw_mt-6 sm:tw_mt-0">
          <h2 class="h1">The Process</h2>
          <p class="tw_text-lg">
            The full process of organizing, scanning, editing, and uploading photos and videos is
            quite the task. This project is a labor of love and a way to preserve the past for
            future generations.
          </p>
          <p class="tw_text-lg">
            I have documented the entire process to hopefully inspire others to do the same.
          </p>
          <q-btn
            label="Read More"
            color="primary"
            unelevated
            no-caps
            to="/process"
            class="tw_my-4"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="postcss"></style>
