export const useGeneralStore = defineStore('general', {
  state: () => ({
    isFullPageLoading: false,
  }),
  getters: {},
  actions: {
    showFullPageLoading() {
      this.isFullPageLoading = true;
    },
    hideFullPageLoading() {
      this.isFullPageLoading = false;
    },
  },
});
