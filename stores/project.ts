type ComponentConfig = {
  sub_path: string;
  json: Record<any, any>;
};
type Config = Record<any, any>;

export const useProjectStore = defineStore('project', {
  state: () => ({
    projectInfo: {} as any,
    config: {} as Config,
    componentConfig: [] as ComponentConfig[],
    buildLog: '',
  }),
  getters: {},
  actions: {
    clearProjectInfo() {
      this.projectInfo = {};
    },
    setProjectInfo(info: any) {
      this.projectInfo = info;
    },
    clearConfig() {
      this.config = {};
    },
    setConfig(config: Config) {
      this.config = config;
    },
    setComponentConfig(config: ComponentConfig[]) {
      this.componentConfig = config;
    },
    setBuildLog(log: string) {
      this.buildLog = log;
    },
    clearBuildLog() {
      this.buildLog = '';
    },
  },
});
