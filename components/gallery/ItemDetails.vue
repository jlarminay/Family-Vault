<script setup lang="ts">
import dayjs from 'dayjs';

const emits = defineEmits(['edit']);
const props = defineProps({
  itemId: {
    type: Number,
    required: true,
  },
});

const itemStore = useItemStore();
const details = ref<any>([]);
const loading = ref(false);
const showEditModal = ref<boolean>(false);

async function refreshData() {
  loading.value = true;
  details.value = await itemStore.getSingle(props.itemId.toString());
  loading.value = false;
}

watch(
  () => props.itemId,
  () => {
    refreshData();
  },
  { immediate: true },
);
</script>

<template>
  <div>
    <div v-if="!loading" class="tw_flex tw_flex-col tw_gap-6 tw_h-full">
      <GalleryLockWarning :item="details" />

      <!-- Editable data -->
      <div class="tw_flex tw_flex-col tw_gap-6">
        <!-- Date Taken -->
        <div class="tw_flex tw_gap-4 tw_items-start">
          <q-icon size="24px" name="o_today" class="tw_mt-1.5" />
          <div class="tw_flex tw_flex-col">
            <p class="tw_text-gray-500 tw_leading-none tw_text-sm">
              Date Taken
              <span v-if="details.dateEstimate" class="tw_text-xs"> (Estimate) </span>
            </p>
            <p class="tw_text-base">
              {{ dayjs(details.takenAt).format('MMMM D, YYYY') }}
            </p>
          </div>
        </div>

        <!-- Description -->
        <div class="tw_flex tw_gap-4 tw_items-start">
          <q-icon size="24px" name="o_description" class="tw_mt-1.5" />
          <div class="tw_flex tw_flex-col">
            <p class="tw_text-gray-500 tw_leading-none tw_text-sm">Description</p>
            <p class="tw_text-base tw_leading-tight">{{ details.description || '-' }}</p>
          </div>
        </div>

        <!-- People -->
        <div class="tw_flex tw_gap-4 tw_items-start">
          <q-icon size="24px" name="o_people" class="tw_mt-1.5" />
          <div class="tw_flex tw_flex-col">
            <p class="tw_text-gray-500 tw_leading-none tw_text-sm">People</p>
            <p v-if="details.people" class="tw_text-base tw_leading-tight">
              <span v-for="(person, i) in details.people.split(',')" :key="i">
                <span>{{ person }}</span>
                <span>{{ i === details.people.split(',').length - 1 ? '' : ', ' }}</span>
              </span>
            </p>
            <p v-else class="tw_text-base tw_leading-tight">
              <span>-</span>
            </p>
          </div>
        </div>

        <!-- Location -->
        <div class="tw_flex tw_gap-4 tw_items-start">
          <q-icon size="24px" name="o_location_on" class="tw_mt-1.5" />
          <div class="tw_flex tw_flex-col">
            <p class="tw_text-gray-500 tw_leading-none tw_text-sm">Location</p>
            <div v-if="details.location">
              <div v-if="details.location.name" class="tw_text-base">
                <p>{{ details.location.name || '-' }}</p>
                <p class="tw_text-xs tw_text-gray-400">
                  {{ details.location.city || '-' }}, {{ details.location.country || '-' }}
                </p>
              </div>
              <p v-else class="tw_text-base">
                {{ details.location.city || '-' }}, {{ details.location.country || '-' }}
              </p>
            </div>
            <p v-else>-</p>
          </div>
        </div>
      </div>

      <hr />

      <div class="tw_flex tw_flex-col tw_gap-6">
        <!-- Resolution -->
        <div class="tw_flex tw_gap-4 tw_items-start">
          <q-icon size="24px" name="o_aspect_ratio" class="tw_mt-1.5" />
          <div class="tw_flex tw_flex-col">
            <p class="tw_text-gray-500 tw_leading-none tw_text-sm">Resolution</p>
            <p class="tw_text-base">
              {{ details.metadata?.resolution }}
              {{
                getAspectRatio(details.metadata?.resolution)
                  ? `(${getAspectRatio(details.metadata?.resolution)})`
                  : ''
              }}
            </p>
          </div>
        </div>

        <!-- Size -->
        <div class="tw_flex tw_gap-4 tw_items-start">
          <q-icon size="24px" name="o_sd_card" class="tw_mt-1.5" />
          <div class="tw_flex tw_flex-col">
            <p class="tw_text-gray-500 tw_leading-none tw_text-sm">Size</p>
            <p class="tw_text-base">{{ formatSize(details.size) }}</p>
          </div>
        </div>

        <!-- Filename -->
        <div class="tw_flex tw_gap-4 tw_items-start">
          <q-icon size="24px" name="o_folder" class="tw_mt-1.5" />
          <div class="tw_flex tw_flex-col">
            <p class="tw_text-gray-500 tw_leading-none tw_text-sm">Filename</p>
            <p class="tw_text-base">{{ details.name }}</p>
          </div>
        </div>

        <!-- Added Date -->
        <div class="tw_flex tw_gap-4 tw_items-start">
          <q-icon size="24px" name="o_today" class="tw_mt-1.5" />
          <div class="tw_flex tw_flex-col">
            <p class="tw_text-gray-500 tw_leading-none tw_text-sm">Added Date</p>
            <p class="tw_text-base">
              {{ dayjs(details.createdAt).format('MMMM D, YYYY') }}
            </p>
          </div>
        </div>

        <!-- Added By -->
        <div class="tw_flex tw_gap-4 tw_items-center">
          <div class="tw_w-[24px] tw_aspect-square tw_rounded-full tw_overflow-hidden tw_border">
            <img :src="details.owner.avatar" class="tw_w-full" />
          </div>
          <div class="tw_flex tw_flex-col">
            <p class="tw_text-gray-500 tw_leading-none tw_text-sm">Added By</p>
            <p class="tw_text-base">{{ details.owner.name }}</p>
          </div>
        </div>
      </div>

      <!-- Edit Button -->
      <q-btn unelevated no-caps label="Edit Info" color="primary" @click="showEditModal = true" />
    </div>

    <!-- Loading -->
    <div v-else class="tw_flex tw_justify-center tw_items-center tw_h-full">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <!-- Edit Modal -->
    <GalleryEditModal
      v-if="!loading && details"
      v-model="showEditModal"
      :item="details"
      @update="
        refreshData();
        showEditModal = false;
      "
      @close="showEditModal = false"
    />
  </div>
</template>

<style scoped lang="postcss"></style>
