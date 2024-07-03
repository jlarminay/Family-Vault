<script setup lang="ts">
import dayjs from 'dayjs';
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  liked: {
    type: Boolean,
    default: false,
  },
  expandedView: {
    type: Boolean,
    default: false,
  },
});

const file = computed(() => {
  if (props.item.file.length === 0) {
    return { path: 'https://placehold.co/640x360?text=Processing...' };
  }

  if (props.item.type === 'video') {
    const video = props.item.file.find((f: any) => f.type === 'video');
    const image = props.item.file.find((f: any) => f.type === 'image');
    return {
      ...video,
      path: image.path,
    };
  }

  return props.item.file[0];
});
</script>

<template>
  <NuxtLink
    class="tw_inline-block tw_w-full tw_rounded tw_overflow-hidden tw_transition hover:tw_bg-slate-200 tw_p-2"
    :class="{ 'tw_cursor-not-allowed tw_opacity-70': item.status === 'processing' }"
    :to="
      item.status === 'processing'
        ? ''
        : { path: $route.path, query: { ...$route.query, id: item.id } }
    "
    replace
  >
    <div class="tw_relative tw_rounded">
      <img :src="file.path" class="tw_w-full tw_aspect-video tw_object-cover tw_rounded" />
      <span
        v-if="item.status !== 'processing' && item.type === 'video'"
        class="tw_absolute tw_bottom-0 tw_right-0 tw_px-2 tw_p-0.5 tw_bg-black tw_bg-opacity-60 tw_text-white tw_rounded-tl tw_rounded-br"
      >
        {{ formatDuration(file.metadata?.duration) }}
      </span>
      <div v-if="item.published !== 'public'" class="tw_absolute tw_top-1 tw_left-1">
        <q-icon
          name="lock"
          class="tw_absolute tw_text-white tw_blur-[2px] tw_opacity-30 tw_text-2xl tw_rounded-full tw_p-0.5"
        />
        <q-icon
          name="lock"
          class="tw_absolute tw_text-primary tw_text-2xl tw_rounded-full tw_p-0.5"
        />
      </div>
      <div v-if="liked" class="tw_absolute tw_top-1 tw_right-1">
        <q-icon
          name="o_favorite"
          class="tw_absolute tw_right-0 tw_text-white tw_blur-[2px] tw_opacity-30 tw_text-2xl tw_rounded-full tw_p-0.5"
        />
        <q-icon
          name="o_favorite"
          class="tw_absolute tw_right-0 tw_text-red-600 tw_text-2xl tw_rounded-full tw_p-0.5"
        />
      </div>
    </div>
    <div v-if="expandedView" class="tw_mt-2 tw_text-gray-500">
      <p
        v-for="(desc, i) in [
          { label: 'Display:', value: item.dateDisplay },
          { label: 'Order:', value: item.dateOrder },
          { label: 'Desc:', value: item.description },
          { label: 'People:', value: item.people },
        ]"
        :key="i"
        class="tw_text-sm tw_truncate"
      >
        <b>{{ desc.label }}</b>
        {{ desc.value }}
      </p>
    </div>
  </NuxtLink>
</template>

<style scoped lang="postcss"></style>
