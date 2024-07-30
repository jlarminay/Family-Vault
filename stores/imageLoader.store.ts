// store/imageLoader.ts
import { defineStore } from 'pinia';

interface ImageLoaderState {
  loadingQueue: HTMLImageElement[];
  observer: IntersectionObserver | null;
  isLoading: boolean;
}

export const useImageLoaderStore = defineStore('imageLoader', {
  state: (): ImageLoaderState => ({
    loadingQueue: [],
    observer: null,
    isLoading: false,
  }),
  actions: {
    initObserver() {
      if (!this.observer) {
        this.observer = new IntersectionObserver(this.onIntersection, {
          root: null,
          rootMargin: '0px',
          threshold: 0.1,
        });
      }
    },
    observeImage(image: HTMLImageElement) {
      if (this.observer) {
        this.observer.observe(image);
      }
    },
    onIntersection(entries: IntersectionObserverEntry[]) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.addToQueue(entry.target as HTMLImageElement);
        }
      });
      this.processQueue();
    },
    addToQueue(image: HTMLImageElement) {
      if (!this.loadingQueue.includes(image)) {
        this.loadingQueue.push(image);
      }
    },
    async processQueue() {
      if (this.loadingQueue.length > 0 && !this.isLoading) {
        const imagesToLoad = this.loadingQueue.splice(0, 1);
        this.isLoading = true;
        for (const image of imagesToLoad) {
          await this.loadImage(image);
        }
        this.isLoading = false;
        this.processQueue(); // Continue processing the queue
      }
    },
    async loadImage(image: HTMLImageElement) {
      const src = image.dataset.src;
      if (src) {
        const img = new Image();
        img.src = src;
        await new Promise((resolve) => {
          img.onload = () => {
            image.src = src;
            resolve(true);
          };
        });
        // await new Promise((resolve) => setTimeout(resolve, 250)); // Simulate loading time
      }
    },
  },
});
