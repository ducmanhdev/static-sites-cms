export const useGeneralStore = defineStore('general', {
  state: () => ({
    isAsideVisible: true,
    isFullPageLoading: false,
  }),
  getters: {},
  actions: {
    hideAside() {
      this.isAsideVisible = false;
    },
    showAside() {
      this.isAsideVisible = true;
    },
    toggleAsideVisible() {
      this.isAsideVisible = !this.isAsideVisible;
    },
    showFullPageLoading() {
      this.isFullPageLoading = true;
    },
    hideFullPageLoading() {
      this.isFullPageLoading = false;
    },
  },
});
