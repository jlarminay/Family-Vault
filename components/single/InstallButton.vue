<script setup lang="ts">
const canInstall = ref(false); // Controls whether the button is visible
let deferredPrompt: any = null; // Caches the install prompt

onMounted(() => {
  // Capture the `beforeinstallprompt` event and suppress the default behavior
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault(); // Prevent the default install popup
    deferredPrompt = event; // Cache the install prompt
    canInstall.value = true; // Show the install button
  });
});

async function install() {
  if (deferredPrompt) {
    deferredPrompt.prompt(); // Show the manual install prompt
    const choiceResult = await deferredPrompt.userChoice;
    deferredPrompt = null; // Reset the cached prompt after use
    canInstall.value = false; // Optionally hide the button after install
  }
}
</script>

<template>
  <q-item v-if="canInstall" clickable v-close-popup @click="install">
    <q-item-section avatar>
      <q-icon name="o_download" />
    </q-item-section>
    <q-item-section>Install App</q-item-section>
  </q-item>
</template>

<style scoped lang="postcss"></style>
