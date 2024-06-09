<script setup lang="ts">
definePageMeta({
  middleware: 'authorized-only',
});
const { data: authData } = useAuth();

const form = ref<any>(false);
const userStore = useUserStore();
const loading = ref(false);
const editUser = ref({
  name: authData.value?.name || '',
  email: authData.value?.email || '',
  provider: authData.value?.provider
    ? authData.value?.provider?.charAt(0).toUpperCase() + authData.value?.provider?.slice(1)
    : '',
});

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
    <main class="tw_px-6 tw_py-4 tw_max-w-[800px] tw_mx-auto">
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
    </main>
  </NuxtLayout>
</template>

<style scoped lang="postcss"></style>
