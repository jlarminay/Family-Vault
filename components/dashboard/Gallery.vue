<script setup lang="ts">
import lightGallery from 'lightgallery';
import lgVideo from 'lightgallery/plugins/video';
import lgHash from 'lightgallery/plugins/hash';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-video.css';

const props = defineProps<{
  allItems: Array<any>;
  allLikes: Array<any>;
  loading: boolean;
  expandedView: boolean;
}>();

const gallery = ref<any>(null);
const currentSelectedItem = ref<any>(null);
const showCommentData = ref<boolean>(false);
const showInfoData = ref<boolean>(false);

// watch items to refresh gallery
watch(
  () => props.allItems,
  async () => {
    console.log('allItems changed');
    await nextTick();
    manageGallery();
  },
);

// watch for sidemenu
watch(
  () => [showCommentData.value, showInfoData.value],
  async () => {
    console.log('sidemenu changed');

    const lgOuter = document.querySelector('.lg-outer');
    const sidebarData = document.getElementById('sidebarData');
    if (!lgOuter || !sidebarData) return;

    if (showCommentData.value || showInfoData.value) {
      lgOuter.classList.add('!tw_w-[calc(100vw-300px)]');
      sidebarData.classList.add('!tw_w-[300px]');
      sidebarData.classList.remove('!tw_w-0');
    } else {
      lgOuter.classList.remove('!tw_w-[calc(100vw-300px)]');
      sidebarData.classList.remove('!tw_w-[300px]');
      sidebarData.classList.add('!tw_w-0');
    }
  },
);

function manageGallery() {
  const element = document.getElementById('lightGallery');
  if (element && !gallery.value) {
    gallery.value = lightGallery(element, {
      plugins: [lgVideo, lgHash],
      selector: '.gallery-item',
      loop: false,
      hash: true,
      download: false,
      autoplayFirstVideo: false,
    });
    // add event listeners
    element.addEventListener('lgBeforeSlide', (event: any) => {
      // get current item
      const index = event.detail.index;
      const allItems = props.allItems.flatMap((group) => group.items);
      currentSelectedItem.value = allItems[index] || null;
      // stop body from scrolling
      document.body.style.overflow = 'hidden';
    });
    element.addEventListener('lgBeforeClose', (event: any) => {
      // hide sidebar
      showCommentData.value = false;
      showInfoData.value = false;
      // remove current item
      currentSelectedItem.value = null;
      // allow body to scroll
      document.body.style.overflow = 'auto';
    });
    // add custom controls
    moveCustomControls();
  } else {
    gallery.value.refresh();
  }
}
function moveCustomControls() {
  const toolbar = document.querySelector('.lg-toolbar');
  const customButtonsContainer = document.getElementById('customButtons');

  if (toolbar && customButtonsContainer) {
    toolbar.appendChild(customButtonsContainer);
    customButtonsContainer.classList.remove('tw_hidden');
  }
}

onUnmounted(() => {
  if (gallery.value) {
    gallery.value.destroy();
  }
});
</script>

<template>
  <div>
    <div
      v-if="allItems.length === 0 && !loading"
      class="tw_text-lg tw_mt-4 tw_text-center tw_italic tw_opacity-70 tw_w-full"
    >
      No Items Found
    </div>

    <div id="lightGallery">
      <div v-for="(group, i) in allItems" :key="i" class="tw_my-4">
        <h2 class="h2 tw_ml-2 tw_mb-1">{{ group.label }}</h2>

        <div class="tw_flex tw_gap-0 tw_justify-start tw_flex-wrap tw_items-start tw_@container">
          <DashboardItem
            v-for="(item, i) in group.items"
            :key="i"
            :expandedView="expandedView"
            :item="item"
            :liked="allLikes.some((like: any) => like.itemId === item.id)"
            class="gallery-item tw_w-1/3 @lg:tw_w-1/3 @xl:tw_w-1/3 @3xl:tw_w-1/4 @5xl:tw_w-1/5 @7xl:tw_w-1/6"
          />
        </div>
      </div>
    </div>

    <!-- Custom Icons -->
    <div id="customButtons" class="tw_hidden">
      <div class="tw_flex tw_items-center tw_pr-[20px] tw_gap-1">
        <LikeButton v-if="currentSelectedItem" :itemId="currentSelectedItem.id" />
        <q-btn
          round
          flat
          icon="o_info"
          @click="
            showCommentData = false;
            showInfoData = !showInfoData;
          "
        />
        <q-btn
          round
          flat
          icon="o_chat"
          @click="
            showInfoData = false;
            showCommentData = !showCommentData;
          "
        />
        <q-btn round flat icon="o_close" @click="gallery.closeGallery()" />
      </div>
    </div>

    <!-- Sidebar Data -->
    <DashboardSidebar
      id="sidebarData"
      :selectedItem="currentSelectedItem"
      :showInfoData="showInfoData"
      :showCommentData="showCommentData"
    />
  </div>
</template>

<style scoped lang="postcss"></style>
