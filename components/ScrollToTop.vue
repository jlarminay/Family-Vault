<script setup lang="ts">
const showButton = ref(false);

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

function handleScroll() {
  showButton.value = window.scrollY > 100;
}
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>

<template>
  <q-page-sticky position="bottom-right" :offset="[18, 18]">
    <q-btn
      fab
      icon="o_keyboard_arrow_up"
      color="primary"
      @click="scrollToTop"
      class="tw_transition-opacity tw_duration-200"
      :class="{ 'tw_opacity-0 tw_pointer-events-none': !showButton }"
    />
  </q-page-sticky>
</template>

<style scoped lang="postcss"></style>
