<script setup lang="ts">
const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="tw_flex tw_gap-4 tw_items-start tw_mt-6 tw_group">
    <div class="tw_w-[40px] tw_h-[40px] tw_rounded-full tw_overflow-hidden">
      <img :src="comment.user.avatar" class="tw_w-full tw_h-full tw_object-cover" />
    </div>
    <div class="tw_flex-1">
      <div class="tw_flex tw_items-center tw_justify-between">
        <div>
          <p class="tw_font-bold tw_mb-0">{{ comment.user.name }}</p>
          <p class="tw_text-sm tw_text-gray-500">
            {{ $dayjs(comment.createdAt).from($dayjs()) }}
          </p>
        </div>
        <div>
          <!-- <q-btn
            v-if="false"
            round
            flat
            icon="sym_o_more_vert"
            size="14px"
            class="tw_p-0 tw_min-w-[2rem] tw_min-h-[2rem] tw_opacity-0 group-hover:tw_opacity-100 tw_transition-opacity tw_duration-300"
          >
            <q-menu>
              <q-list>
                <q-item clickable>
                  <q-item-section>Report</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Delete</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn> -->
        </div>
      </div>

      <p class="tw_mt-1 tw_whitespace-pre">
        {{ comment.text }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
