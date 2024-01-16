<script setup lang="ts">
definePageMeta({
  middleware: 'authorized-only',
});
</script>

<template>
  <Head>
    <title>Admin | Larminay Vault</title>
  </Head>

  <div>
    <SingleNavMenu />

    <main class="tw_px-6 tw_py-4 tw_max-w-[1400px] tw_mx-auto">
      <h1 class="h1">Admin</h1>
      <div class="tw_mt-6">
        <ul>
          <li>Counts</li>
          <li><q-btn to="/admin/users" label="Users" /></li>
          <li><q-btn to="/admin/reports" label="Reports" /></li>
          <li>All videos?</li>
          <li>All collections</li>
          <li>Settings?</li>
        </ul>
      </div>
    </main>
  </div>
</template>

<style scoped lang="postcss"></style>
