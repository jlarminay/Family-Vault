<script setup lang="ts">
const { signIn } = useAuth();

const form = ref<any>(null);
const showModal = ref(false);
const account = ref({
  email: '',
  password: '',
});
</script>

<template>
  <div>
    <q-btn
      test-label="loginWithCredentials"
      no-caps
      unelevated
      size="18px"
      class="tw_w-full tw_bg-[#973cd2] tw_text-white tw_hidden"
      @click="showModal = true"
    >
      Login with Credentials
    </q-btn>

    <Modal v-model="showModal">
      <template #title>Test Login</template>
      <template #body>
        <q-form ref="form" greedy>
          <q-input
            v-model="account.email"
            label="Email"
            test-label="email"
            outlined
            maxlength="64"
            counter
            :rules="[
              (val: string) => !!val || 'Please enter a reason',
              (val: string) => val.length <= 64 || 'Email must be less than 64 characters',
            ]"
          />
          <q-input
            v-model="account.password"
            label="Password"
            test-label="password"
            outlined
            type="password"
            maxlength="64"
            counter
            :rules="[
              (val: string) => !!val || 'Please enter a reason',
              (val: string) => val.length <= 64 || 'Password must be less than 64 characters',
            ]"
          />
        </q-form>
      </template>
      <template #actions>
        <q-btn outline no-caps label="Cancel" color="dark" v-close-popup />
        <q-btn
          label="Login"
          test-label="submit"
          unelevated
          no-caps
          color="primary"
          @click="signIn('credentials', account)"
        />
      </template>
    </Modal>
  </div>
</template>

<style scoped lang="postcss"></style>
