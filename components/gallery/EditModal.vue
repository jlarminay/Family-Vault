<script setup lang="ts">
import validator from 'validator';
const userStore = useUserStore();
const itemStore = useItemStore();
const locationStore = useLocationStore();

const { data: authData } = useAuth();
const emits = defineEmits(['update', 'close']);
const props = defineProps<{
  item: object;
}>();

const form = ref<any>(null);
const allUsers = ref<any>([]);
const allLocations = ref<any>([]);
const itemEdit = ref<any>({});
const showNewLocation = ref(false);
const newLocation = ref<any>({});
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
  allLocations.value = await locationStore.getAll({ named: true });
  loading.value = false;
});

function closeModal() {
  itemEdit.value = JSON.parse(JSON.stringify(props.item));
  showNewLocation.value = false;
  newLocation.value = {};
}

async function updateItem() {
  if (!(await form.value.validate())) return;
  //
  loading.value = true;
  let response = await itemStore.update({
    ...itemEdit.value,
    newLocation: newLocation.value,
  });
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
  <Modal class="tw_w-full" @hide="closeModal">
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
            maxlength="500"
            autogrow
            counter
            :rules="[(val: string) => !val || val.length <= 500 || 'Max 500 characters']"
          />
          <q-input
            outlined
            no-error-icon
            v-model="itemEdit.people"
            label="Who's in the video/image?"
            maxlength="200"
            autogrow
            counter
            :rules="[(val: string) => !val || val.length <= 200 || 'Max 200 characters']"
          />
        </div>

        <!-- Date -->
        <div class="tw_mt-2">
          <h3 class="h3 tw_font-bold tw_mb-2">Date</h3>
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
        </div>

        <!-- Location -->
        <div class="tw_mt-2 tw_mb-[20px]">
          <h3 class="h3 tw_font-bold tw_mb-2">Location</h3>
          <div class="tw_flex tw_justify-between tw_items-center tw_gap-4">
            <q-select
              behavior="menu"
              outlined
              no-error-icon
              v-model="itemEdit.locationId"
              option-value="id"
              option-label="name"
              label="Location"
              :disable="showNewLocation"
              emit-value
              map-options
              clearable
              :options="allLocations"
              class="tw_grow"
            >
              <template #selected-item="scope">
                <span v-if="scope.opt.name">{{ scope.opt.name }}</span>
                <span v-else class="tw_text-gray-400 tw_italic">
                  {{ itemEdit.location.city }}, {{ itemEdit.location.country }}
                </span>
              </template>
            </q-select>
            <q-btn
              no-caps
              unelevated
              color="primary"
              :label="!showNewLocation ? '+ New Location' : 'Cancel'"
              class="tw_mb-2"
              @click="showNewLocation = !showNewLocation"
            />
          </div>
          <div v-if="showNewLocation" class="tw_border tw_px-4 tw_pt-2 tw_rounded tw_bg-gray-50">
            <p class="tw_text-sm tw_mb-2 tw_text-center tw_text-gray-500">
              If a name is given, it will be added to the above list.
            </p>
            <q-input outlined no-error-icon v-model="newLocation.name" label="Location Name" />
            <q-input
              v-if="showNewLocation"
              outlined
              no-error-icon
              v-model="newLocation.latLong"
              label="Latitude and Longitude"
              required
              :rules="[
                (val: string) => !!val || 'Required',
                (val: string) =>
                  validator.isLatLong(val) || 'Must be in the format of Latitude, Longitude',
              ]"
            />
          </div>
          <!-- <div class="tw_flex tw_justify-between tw_items-center tw_gap-4">
            <q-input
              outlined
              no-error-icon
              v-model="itemEdit.locationId"
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
                <q-icon name="o_home" class="cursor-pointer tw_pr-2">
                  <q-menu anchor="bottom end" self="top end">
                    <q-list>
                      <q-item
                        v-for="(location, i) in [
                          {
                            label: 'Mireille\'s House',
                            value: '48.45050868490577, -123.36516816965117',
                          },
                          {
                            label: 'Cindi\'s House',
                            value: '48.45247192226103, -123.39886027226653',
                          },
                          {
                            label: 'Quadra School',
                            value: '48.44598351009871, -123.36055427827353',
                          },
                          {
                            label: 'Forest Museum',
                            value: '48.802224154212766, -123.71536180445196',
                          },
                        ]"
                        clickable
                        @click="itemEdit.location = location.value"
                        v-close-popup
                      >
                        <q-item-section>{{ location.label }}</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-icon>
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
          </div> -->
        </div>

        <!-- Security -->
        <div v-if="authData?.role === 'admin'" class="tw_mt-2">
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
