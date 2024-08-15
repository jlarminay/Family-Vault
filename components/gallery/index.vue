<script setup lang="ts">
import lightGallery from 'lightgallery';
import lgVideo from 'lightgallery/plugins/video';
import lgHash from 'lightgallery/plugins/hash';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-video.css';

const emits = defineEmits(['loadMore', 'updateLike']);
const props = defineProps<{
  allItems: Array<any>;
  allLikes: Array<any>;
  loading: boolean;
  expandedView: boolean;
}>();
const route = useRoute();

const $q = useQuasar();
const itemStore = useItemStore();
const gallery = ref<any>(null);
const currentSelectedItem = ref<any>(null);
const showCommentData = ref<boolean>(false);
const showInfoData = ref<boolean>(false);
const showShareModal = ref<boolean>(false);

// watch items to refresh gallery
watch(
  () => props.allItems,
  async () => {
    await nextTick();
    manageGallery();
  },
  { immediate: true },
);

// watch for sidemenu
watch(
  () => [showCommentData.value, showInfoData.value],
  async () => {
    const lgOuter = document.querySelector('.lg-outer');
    if (!lgOuter) return;

    if ($q.screen.gt.xs && (showCommentData.value || showInfoData.value)) {
      lgOuter.classList.add('!tw_w-[calc(100vw-300px)]');
    } else {
      lgOuter.classList.remove('!tw_w-[calc(100vw-300px)]');
    }
  },
);

// watch for url change
watch(
  () => route.fullPath,
  (newUrl, oldUrl) => {
    watchForUrlChange();
  },
);

function manageGallery() {
  const element = document.getElementById('lightGallery');
  if (element && !gallery.value) {
    gallery.value = lightGallery(element, {
      plugins: [lgVideo, lgHash],
      selector: '.gallery-item',
      loop: false,
      galleryId: 'gallery',
      hash: false,
      download: false,
      keyPress: false,
      autoplayFirstVideo: false,
    });
    // add event listeners
    element.addEventListener('lgBeforeSlide', (event: any) => {
      // update url hash
      pushToHistory(event.detail.index);
      // get current item
      const index = event.detail.index;
      const allItems = props.allItems.flatMap((group) => group.items);
      currentSelectedItem.value = allItems[index] || null;
      // stop body from scrolling
      document.body.style.overflow = 'hidden';
      // if index is penultimate item, load more
      if (index === allItems.length - 2) {
        emits('loadMore');
      }
    });
    element.addEventListener('lgAfterSlide', (event: any) => {
      // increment view count
      if (currentSelectedItem.value) {
        itemStore.incrementViewCount(currentSelectedItem.value.id);
      }
    });
    element.addEventListener('lgBeforeClose', (event: any) => {
      // update url hash
      pushToHistory(false);
      // hide sidebar
      showCommentData.value = false;
      showInfoData.value = false;
      // remove current item
      currentSelectedItem.value = null;
      // allow body to scroll
      document.body.style.overflow = 'auto';
    });
    ['hashchange', 'popstate'].forEach((event) => {
      window.addEventListener(event, watchForUrlChange);
    });
    // add custom controls
    moveCustomControls();
    // open if id is in url
    const id = route.query.id as string | undefined;
    const totalLength = props.allItems.flatMap((group) => group.items).length;
    if (id && parseInt(id) < totalLength) {
      gallery.value.openGallery(parseInt(id));
    }
  } else {
    gallery.value.refresh();
    // open if id is in url
    const id = route.query.id as string | undefined;
    const totalLength = props.allItems.flatMap((group) => group.items).length;
    if (id && parseInt(id) < totalLength) {
      gallery.value.openGallery(parseInt(id));
    }
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
function closeSidebar() {
  showCommentData.value = false;
  showInfoData.value = false;
}

function pushToHistory(id: string | false) {
  const urlObj = new URL(location.href);
  const searchParams = urlObj.searchParams;

  if (id === false) {
    searchParams.delete('id');
  } else {
    if (searchParams.has('search')) {
      searchParams.delete('id');
      searchParams.append('id', id);
    } else {
      searchParams.set('id', id);
    }
  }

  history.pushState({}, '', urlObj.toString());
  return;
}
function watchForUrlChange() {
  const id = route.query.id as string | undefined;
  if (id) {
    gallery.value.openGallery(parseInt(id));
  } else {
    gallery.value.closeGallery();
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
        <h2 class="h2 tw_ml-0.5 sm:tw_ml-2 sm:tw_mb-1">
          {{ group.label === 'January 1900' ? 'Unknown Date' : group.label }}
        </h2>

        <div class="tw_flex tw_gap-0 tw_justify-start tw_flex-wrap tw_items-start tw_@container">
          <GalleryItem
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
        <q-btn round flat icon="o_share" @click="showShareModal = true" />
        <LikeButton
          v-if="currentSelectedItem"
          :itemId="currentSelectedItem.id"
          @updateLike="emits('updateLike')"
        />
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
    <div
      id="sidebarOverlay"
      class="tw_opacity-0 tw_fixed tw_top-0 tw_left-0 tw_w-full tw_h-full tw_z-[12002]"
      :class="{ tw_hidden: (!showCommentData && !showInfoData) || $q.screen.gt.xs }"
      @click="closeSidebar"
      v-touch-swipe.mouse.right="closeSidebar"
    />
    <GallerySidebar
      id="sidebarData"
      :selectedItem="currentSelectedItem"
      :showInfoData="showInfoData"
      :showCommentData="showCommentData"
      class="tw_max-w-[80%]"
      :class="{
        'tw_w-0': !showCommentData && !showInfoData,
        'tw_w-[300px]': showCommentData || showInfoData,
      }"
      v-touch-swipe.mouse.right="closeSidebar"
    />

    <!-- Edit Modal -->

    <GalleryShareModal :item="currentSelectedItem" v-model="showShareModal" />
  </div>
</template>

<style scoped lang="postcss"></style>
