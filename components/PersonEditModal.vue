<script setup lang="ts">
import validator from 'validator';
const emit = defineEmits(['personUpdated']);
const props = defineProps({
  mode: {
    type: String,
    required: true,
  },
  person: {
    type: Object,
    required: false,
    default: { gender: 'Other' },
  },
});
const personStore = usePersonStore();
const modal = ref<any>(false);
const form = ref<any>(false);
const loading = ref(false);
const realPerson = ref<any>(props.person);
const newImage = ref<any>({});

async function submitPerson() {
  if (!(await form.value.validate()) || newImage.value.error) return;
  loading.value = false;
  const response = await personStore.createOrUpdate(realPerson.value, newImage.value);
  loading.value = false;
  if (!response) {
    toaster({ type: 'error', message: 'Something went wrong.<br/>Please try again later.' });
    return;
  }
  toaster({ type: 'success', message: 'Successfully created person.' });
  modal.value.hide();
  realPerson.value = { gender: 'Other' };
  emit('personUpdated');
}
</script>

<template>
  <Modal ref="modal" class="tw_w-full" @hide="realPerson = {}">
    <template #title>{{ mode === 'new' ? 'New' : 'Edit' }} Person</template>
    <template #body>
      <pre>{{ realPerson }}</pre>
      <q-form ref="form" greedy>
        <q-input
          outlined
          no-error-icon
          v-model="realPerson.name"
          label="Name"
          required
          maxlength="128"
          counter
          :rules="[
            (val: string) => !!val || 'Required',
            (val: string) => val.length <= 128 || 'Max 128 characters',
          ]"
        />
        <q-select
          outlined
          no-error-icon
          v-model="realPerson.gender"
          label="Gender"
          :options="['Male', 'Female', 'Other']"
          required
          :rules="[(val: string) => !!val || 'Required']"
        />
        <q-input
          outlined
          no-error-icon
          v-model="realPerson.birthday"
          label="Birthday"
          mask="####-##-##"
          :rules="[(val: string) => !val || validator.isISO8601(val) || 'Invalid date']"
        >
          <template v-slot:append>
            <q-icon name="sym_o_calendar_month" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="realPerson.birthday" mask="YYYY-MM-DD">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <FileUpload
          @fileUpdated="newImage = $event"
          :maxSize="2 * 1024 * 1024"
          :formats="['image/png', 'image/jpeg', 'image/jpg']"
        />
      </q-form>
    </template>
    <template #actions>
      <q-btn outline no-caps label="Cancel" color="dark" v-close-popup />
      <q-btn unelevated no-caps label="Create Person" color="primary" @click="submitPerson" />
    </template>
  </Modal>
</template>

<style scoped lang="postcss"></style>
