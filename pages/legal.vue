<script setup lang="ts">
definePageMeta({
  middleware: 'authorized-only',
});
</script>

<template>
  <Head>
    <title>Legal | Larminay Vault</title>
  </Head>

  <NuxtLayout name="app">
    <main class="tw_p-1 sm:tw_px-6 sm:tw_py-4 tw_max-w-[800px] tw_mx-auto">
      <h1 class="h1">Legal</h1>
      <div class="tw_mt-6">
        <p>Copyright © 2024 Josh Larminay</p>
        <p class="tw_mt-2">
          This website and its content are protected by Canadian copyright law. Except as otherwise
          provided for under Canadian copyright law, this website and its content may not be copied,
          published, distributed, downloaded or otherwise stored in a retrieval system, transmitted
          or converted, in any form or by any means, electronic or otherwise, without the prior
          written permission of the copyright owner.
        </p>
      </div>
    </main>
  </NuxtLayout>
</template>

<style scoped lang="postcss"></style>
