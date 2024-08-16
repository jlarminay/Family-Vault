<script setup lang="ts">
import validator from 'validator';
const userStore = useUserStore();
const itemStore = useItemStore();

const { data: authData } = useAuth();
const emits = defineEmits(['update', 'close']);
const props = defineProps<{
  item: object;
}>();

const form = ref<any>(null);
const allUsers = ref<any>([]);
const itemEdit = ref<any>({});
const loading = ref(false);

const cleanedAllowList = computed(() => {
  if (!allUsers.value) return [];
  return allUsers.value.filter((user: any) => {
    if (!itemEdit.value.allowList) return true;
    if (user.value === authData?.value?.id) return false;
    return !itemEdit.value.allowList.some((p: any) => p.value === user.value);
  });
});

onMounted(async () => {
  loading.value = true;
  itemEdit.value = JSON.parse(JSON.stringify(props.item));
  allUsers.value = await userStore.getAll();
  loading.value = false;
});

async function updateItem() {
  if (!(await form.value.validate())) return;
  //
  loading.value = true;
  let response = await itemStore.update(itemEdit.value);
  loading.value = false;
  if (!response) {
    toaster({ type: 'error', message: 'Something went wrong.<br/>Please try again later.' });
    return;
  }
  toaster({ type: 'success', message: 'Successfully edited gallery item.' });
  emits('update');
}
</script>

<template>
  <Modal class="tw_w-full">
    <template #title>Edit Gallery Item</template>
    <template #body>
      <q-form ref="form" greedy @submit="updateItem">
        <!-- Item Content -->
        <div>
          <h3 class="h3 tw_font-bold tw_mb-2">Item Content</h3>
          <q-input
            outlined
            no-error-icon
            v-model="itemEdit.description"
            label="Description"
            maxlength="1024"
            autogrow
            counter
            :rules="[(val: string) => !val || val.length <= 1024 || 'Max 1024 characters']"
          />
          <q-input
            outlined
            no-error-icon
            v-model="itemEdit.people"
            label="Who's in the video/image?"
            maxlength="1024"
            autogrow
            counter
            :rules="[(val: string) => !val || val.length <= 1024 || 'Max 1024 characters']"
          />
          <div class="tw_flex tw_justify-between tw_items-center tw_gap-4">
            <q-input
              outlined
              no-error-icon
              v-model="itemEdit.takenAt"
              label="Date Taken"
              required
              mask="####-##-##"
              :rules="[(val: string) => !!val || 'Required']"
              class="tw_mb-0 tw_grow"
            >
              <template v-slot:append>
                <q-icon name="o_event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="itemEdit.takenAt" mask="YYYY-MM-DD">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-checkbox
              v-model="itemEdit.dateEstimate"
              label="Estimate"
              class="tw_mb-[28px] tw_pr-4"
            />
          </div>
          <div class="tw_flex tw_justify-between tw_items-center tw_gap-4">
            <q-input
              outlined
              no-error-icon
              v-model="itemEdit.location"
              label="Location"
              :rules="[
                (val: string) =>
                  !val ||
                  validator.isLatLong(val) ||
                  'Must be in the format of Latitude, Longitude',
              ]"
              class="tw_mb-0 tw_grow"
            >
              <template v-slot:append>
                <q-icon name="o_info" class="cursor-pointer">
                  <q-menu anchor="bottom end" self="top end" class="tw_p-4 tw_w-[250px]">
                    <p class="tw_mb-2">
                      This field must be in the format of Latitude, Longitude (Ex. 48.42821,
                      -123.37333).
                    </p>
                    <p>This can be gotten from Google Maps.</p>
                  </q-menu>
                </q-icon>
              </template>
            </q-input>
            <q-checkbox
              v-model="itemEdit.locationEstimate"
              label="Estimate"
              class="tw_mb-[28px] tw_pr-4"
            />
          </div>
        </div>

        <!-- Security -->
        <div v-if="authData?.role === 'admin'" class="tw_mt-4">
          <h3 class="h3 tw_font-bold tw_mb-2">
            Security <span class="tw_text-xs">(Admin Only)</span>
          </h3>
          <q-select
            behavior="menu"
            outlined
            no-error-icon
            v-model="itemEdit.published"
            label="Publish Status"
            emit-value
            map-options
            :options="[
              { label: 'Item is private to me', value: 'private' },
              { label: 'Item is public to everyone', value: 'public' },
              { label: 'Item is public to only a few', value: 'allow-few' },
            ]"
            required
            :rules="[(val: string) => !!val || 'Required']"
          />
          <q-select
            v-if="itemEdit.published === 'allow-few'"
            behavior="menu"
            outlined
            no-error-icon
            v-model="itemEdit.allowList"
            label="Who can see the video/image?"
            map-options
            multiple
            use-chips
            hint=""
            :options="cleanedAllowList"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="tw_italic tw_opacity-70 tw_text-base tw_text-center">
                  No options
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>

        <!-- Actions -->
        <div class="tw_flex tw_gap-2 tw_justify-end tw_mt-4">
          <q-btn no-caps unelevated outline color="dark" label="Cancel" @click="emits('close')" />
          <q-btn
            no-caps
            unelevated
            color="primary"
            label="Save Item"
            :loading="loading"
            @click="updateItem"
          />
        </div>
      </q-form>
    </template>
  </Modal>
</template>

<style scoped lang="postcss"></style>
