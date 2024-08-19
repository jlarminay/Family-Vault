<script setup lang="ts">
// definePageMeta({
//   middleware: 'authorized-only',
// });
import VueMarkdown from 'vue-markdown-render';
import copyright from '@/content/legal/copyright.md?raw';
import privacyPolicy from '@/content/legal/privacy_policy.md?raw';
import termsAndConditions from '@/content/legal/terms_and_conditions.md?raw';

const { data: authData } = useAuth();
const currentPage = ref<any>('copyright');

onMounted(() => {
  const page = window.location.hash.replace('#', '');
  if (page) {
    currentPage.value = page;
  }
});

function changePage(page: string) {
  // scroll back to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // change page
  currentPage.value = page;

  // update URL
  window.history.pushState({}, '', `/legal#${page}`);
}
</script>

<template>
  <Head>
    <title>Legal | Larminay Vault</title>
  </Head>

  <NuxtLayout name="app">
    <main class="tw_p-1 sm:tw_px-6 sm:tw_py-4 tw_max-w-[1000px] tw_mx-auto">
      <h1 v-if="!!authData" class="h1">Legal</h1>
      <div class="tw_flex tw_flex-col sm:tw_flex-row tw_gap-4 tw_mt-6">
        <div class="tw_w-full sm:tw_w-[250px] sm:tw_min-w-[250px] tw_flex tw_flex-col tw_gap-2">
          <q-btn
            v-if="!authData"
            flat
            no-caps
            color="dark"
            class="tw_w-full !tw_no-underline"
            align="left"
            icon="o_arrow_back"
            label="Back To Login"
            to="/login"
          />
          <q-btn
            v-for="option in [
              {
                title: 'Copyright',
                code: 'copyright',
              },
              {
                title: 'Terms and Conditions',
                code: 'terms-and-conditions',
              },
              {
                title: 'Privacy Policy',
                code: 'privacy-policy',
              },
            ]"
            :key="option.code"
            flat
            unelevated
            no-caps
            :color="currentPage === option.code ? 'primary' : 'dark'"
            class="tw_w-full"
            align="left"
            :label="option.title"
            @click="changePage(option.code)"
          />
        </div>
        <div>
          <VueMarkdown
            :source="
              currentPage === 'copyright'
                ? copyright
                : currentPage === 'terms-and-conditions'
                  ? termsAndConditions
                  : privacyPolicy
            "
          />
        </div>
      </div>
    </main>
  </NuxtLayout>
</template>

<style scoped lang="postcss">
:deep(*) {
  h1 {
    @apply tw_text-2xl sm:tw_text-3xl tw_font-medium tw_font-montserrat;
    @apply tw_mb-6;
  }
  h2 {
    @apply tw_text-xl sm:tw_text-2xl tw_font-medium tw_font-montserrat;
    @apply tw_mt-6 tw_mb-2;
  }
  h3 {
    @apply tw_text-lg sm:tw_text-xl tw_font-medium tw_font-montserrat;
    @apply tw_mt-4 tw_mb-2;
  }
  p,
  li {
    @apply tw_text-dark tw_text-base tw_font-maven-pro tw_font-normal tw_leading-tight;
    @apply tw_mb-2;
  }
  ul {
    @apply tw_list-disc tw_pl-6 tw_mb-2;
  }
  a {
    @apply tw_text-blue-500 tw_underline hover:tw_opacity-80 tw_transition-opacity tw_duration-300 tw_cursor-pointer;
  }
  code {
    @apply tw_text-sm tw_font-mono tw_bg-gray-100 tw_rounded tw_break-all tw_block tw_py-2 tw_px-4 tw_border-l-4 tw_border-primary tw_mb-4;
  }
}
</style>
