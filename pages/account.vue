<script setup lang="ts">
definePageMeta({
  middleware: 'authorized-only',
});
const { data: authData } = useAuth();

const userStore = useUserStore();
const form = ref<any>(false);
const loading = ref(false);
const editUser = ref({
  name: authData.value?.name || '',
  email: authData.value?.email || '',
  provider: authData.value?.provider
    ? authData.value?.provider?.charAt(0).toUpperCase() + authData.value?.provider?.slice(1)
    : '',
});
const history = ref(await userStore.getHistory());

async function updateUser() {
  if (!(await form.value.validate())) return;
  loading.value = true;
  let response = await userStore.updateOwn(authData.value?.id || 0, editUser.value.name);
  loading.value = false;

  if (!response) {
    toaster({ type: 'error', message: 'Something went wrong.<br/>Please try again later.' });
    return;
  }
  toaster({ type: 'success', message: 'Account updated' });
}
</script>

<template>
  <Head>
    <title>Account | Larminay Vault</title>
  </Head>

  <NuxtLayout name="app">
    <main class="tw_p-1 sm:tw_px-6 sm:tw_py-4 tw_max-w-[800px] tw_mx-auto">
      <!-- Account Info -->
      <div>
        <h1 class="h1">Account</h1>
        <div
          class="tw_flex tw_flex-col md:tw_flex-row tw_justify-start tw_items-start tw_gap-6 tw_mt-6"
        >
          <div class="tw_min-w-[200px] tw_w-[200px] tw_text-center tw_mx-auto">
            <div class="tw_rounded-full tw_border-2 tw_overflow-hidden tw_w-full tw_aspect-square">
              <img :src="authData?.avatar" class="tw_w-full tw_object-cover" />
            </div>
            <p class="tw_pt-2 tw_text-sm tw_italic tw_opacity-70">Image is pulled from provider</p>
          </div>
          <div class="tw_w-full">
            <q-form ref="form" greedy>
              <q-input
                outlined
                no-error-icon
                v-model="editUser.name"
                label="Name"
                required
                maxlength="64"
                counter
                :rules="[
                  (val: string) => !!val || 'Required',
                  (val: string) => val.length <= 64 || 'Max 64 characters',
                ]"
              />
              <q-input
                outlined
                no-error-icon
                v-model="editUser.email"
                label="Email"
                disable
                hint=""
              />
              <q-input
                outlined
                no-error-icon
                v-model="editUser.provider"
                label="Provider"
                disable
                hint=""
              />

              <div class="tw_flex tw_justify-end tw_gap-2">
                <q-btn outline no-caps label="Cancel" color="dark" to="/dashboard" />
                <q-btn
                  unelevated
                  no-caps
                  label="Save"
                  color="primary"
                  :loading="loading"
                  :disable="loading"
                  @click="updateUser"
                />
              </div>
            </q-form>
          </div>
        </div>
      </div>

      <!-- History -->
      <div class="tw_mt-10">
        <h1 class="h1">History <span class="tw_text-lg">(Last 12 videos)</span></h1>

        <div class="tw_flex tw_gap-0 tw_justify-start tw_flex-wrap tw_items-start tw_mt-2">
          <div
            v-if="history.length === 0 && !loading"
            class="tw_text-lg tw_mt-4 tw_text-center tw_italic tw_opacity-70 tw_w-full"
          >
            No Videos Found
          </div>
          <DashboardItem
            v-for="(video, i) in history.map((v: any) => v.video)"
            :key="i"
            :video="video"
            class="tw_w-full md:tw_w-1/2 lg:tw_w-1/3"
          />
        </div>
      </div>
    </main>
  </NuxtLayout>
</template>

<style scoped lang="postcss"></style>
