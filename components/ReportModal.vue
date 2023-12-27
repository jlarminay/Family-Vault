<script setup lang="ts">
const props = defineProps({
  videoId: {
    type: Number,
    required: true,
  },
});

const reportStore = useReportStore();
const modal = ref<any>(false);
const form = ref<any>(false);
const loading = ref(false);
const reportReason = ref('');

async function submitReport() {
  if (!(await form.value.validate())) return;
  loading.value = true;
  let response = await reportStore.create(props.videoId, reportReason.value);
  loading.value = false;
  if (!response) {
    toaster({ type: 'error', message: 'Something went wrong.<br/>Please try again later.' });
    return;
  }
  toaster({ type: 'success', message: 'Thank you for your feedback.' });
  reportReason.value = '';
  modal.value.hide();
}
</script>

<template>
  <Modal ref="modal" class="tw_w-full">
    <template #title>Report Video</template>
    <template #body>
      <q-form ref="form" greedy>
        <p class="tw_mb-2">Why do you want to report the video?</p>
        <q-input
          outlined
          type="textarea"
          rows="4"
          label="Report Reason"
          maxlength="256"
          counter
          v-model="reportReason"
          :rules="[(val) => !!val || 'Please enter a reason']"
        />
      </q-form>
    </template>
    <template #actions>
      <q-btn
        outline
        no-caps
        rounded
        label="Cancel"
        class="tw_text-base"
        color="dark"
        v-close-popup
      />
      <q-btn
        unelevated
        no-caps
        rounded
        label="Submit Report"
        class="tw_text-base"
        color="red"
        @click="submitReport"
      />
    </template>
  </Modal>
</template>

<style scoped lang="postcss"></style>
