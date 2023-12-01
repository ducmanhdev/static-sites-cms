export const useOrganizationStore = defineStore('organization', {
  state: () => ({
    organizationInfo: {} as any,
  }),
  getters: {},
  actions: {
    clearOrganizationInfo() {
      this.organizationInfo = {};
    },
    setOrganizationInfo(info: any) {
      this.organizationInfo = info;
    },
  },
});
