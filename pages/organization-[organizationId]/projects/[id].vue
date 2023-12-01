<template>
  <div class="lg:flex lg:min-h-screen">
    <div v-if="isDeploySuccess" class="w-full min-h-screen flex justify-center items-center p-6">
      <div class="text-center">
        <p class="text-green-600 text-5xl md:text-8xl mb-4">✔</p>
        <h2 class="main-title mb-2">Congratulations</h2>
        <p>Your site is built and ready for next steps. Trying editing or hosting is a great next step.</p>
      </div>
    </div>
    <BaseLoading v-else-if="isGetProjectLoading" class="h-screen w-full"/>
    <template v-else>
      <div v-if="projectInfo?.status === 0" class="p-6 w-full">
        <h2 class="main-title flex items-center gap-4">
          <UIcon name="i-mdi-loading" class="animate-spin"/>
          Project deploying...
        </h2>
        <LazyTerminalLogBuild/>
      </div>
      <template v-else>
        <aside class="lg:w-[300px] shrink-0 bg-gray-100 dark:bg-gray-800 divide-y dark:divide-gray-700">
          <div class="flex justify-between items-center gap-6 lg:hidden py-2 p-6">
            <h2 class="text-2xl font-bold text-center">{{ projectInfo?.name || 'N/A' }}</h2>
            <UButton icon="i-mdi-chevron-down" variant="ghost" size="xl" color="black" @click="handleToggleMenu"/>
          </div>
          <div
              class="p-6 hidden lg:block divide-y dark:divide-gray-700"
              :class="{
              '!block': isMenuVisible,
            }"
          >
            <div class="pb-6 hidden lg:block">
              <h2 class="text-2xl font-bold text-center">{{ projectInfo?.name || 'N/A' }}</h2>
            </div>
            <div class="pb-6 lg:pt-6 space-y-2">
              <UButton variant="link" block :to="projectInfo?.domain_stable" target="_blank" external>
                Live site preview
                <template #trailing>
                  <UIcon name="i-mdi-arrow-top-right"/>
                </template>
              </UButton>
            </div>
            <div class="py-6">
              <UVerticalNavigation
                  :links="links"
                  :ui="{
                  wrapper: 'space-y-1',
                  base: 'text-lg py-2',
                  active: 'before:bg-primary text-white',
                  icon: {
                    active: 'text-white'
                  }
                }"
              />
            </div>
          </div>
        </aside>
        <section class="p-6 grow">
          <NuxtPage />
        </section>
      </template>
    </template>
    <ModalLogBuild ref="modalLogBuildRef"/>
  </div>
</template>

<script setup lang="ts">
import type {MqttClient} from 'mqtt';

definePageMeta({
  nonLayoutPadding: true,
  redirect: () => {
    return {
      name: 'organization-organizationId-projects-id-dashboard',
    };
  },
});

const toast = useToast();
const route = useRoute();
const projectStore = useProjectStore();

const isMenuVisible = ref(false);
const handleToggleMenu = () => {
  isMenuVisible.value = !isMenuVisible.value;
};

const buildStatus = ref(BUILD_STATUS.COMPLETE);

const projectConfig = computed(() => projectStore.config);
const collectionChildren = computed(() => {
  return Object.keys(projectConfig.value?.collections_config || {})
      .filter((key: string) => !['pages', 'data'].includes(key))
      .map((key: string) => ({
        label: capitalize(key),
        to: {
          name: `organization-organizationId-projects-id-${key}`,
        },
        icon: 'i-mdi-folder-multiple',
      }));
});

const handleGetProjectConfig = async () => {
  try {
    projectStore.clearConfig();
    const res: any = await API.getProjectConfig({project_id: Number(route.params.id)});
    projectStore.setConfig(res?.data);
  } catch (error: any) {
    toast.add({
      title: error.message,
      color: 'red',
    });
  }
};

const handleGetProjectComponentConfig = async () => {
  try {
    const res: any = await API.getProjectComponentConfig({project_id: Number(route.params.id)});
    projectStore.setComponentConfig(res?.data);
  } catch (error: any) {
    toast.add({
      title: error.message,
      color: 'red',
    });
  }
};

type ProjectInfo = {
  id: number;
  name: string;
  code: string;
  created_by: {
    id: number;
    username: string;
    email: string;
  };
  template: {
    id: number;
    name: string;
    repository_url: string;
    created_at: string;
  };
  organization: {
    id: number;
    code: string;
    name: string;
    created_at: string;
  };
  source_path: string;
  status: number;
  thumbnails: any;
  icon: any;
  build_lasted_at: any;
  async_lasted_at: any;
  is_processing: number;
  status_build: number;
  domain_stable: string;
  created_at: string;
  updated_at: string;
};
const projectInfo = ref<ProjectInfo | null>(null);
const isGetProjectLoading = ref(false);
const handleGetProjectInfo = async () => {
  try {
    projectStore.clearProjectInfo();
    projectInfo.value = null;
    buildStatus.value = BUILD_STATUS.COMPLETE;
    isGetProjectLoading.value = true;
    const res: any = await API.viewProject({id: Number(route.params.id)});
    if (!res.data?.project) {
      toast.add({
        title: 'Project not found',
        color: 'red',
      });
      return navigateTo({
        name: 'organization-organizationId-projects',
      });
    }
    projectStore.setProjectInfo(res.data.project);
    projectInfo.value = res.data.project;
    buildStatus.value = projectInfo.value?.status_build || BUILD_STATUS.COMPLETE;

    if (res.data.project.status_build === BUILD_STATUS.PROCESSING) {
      mqttHandler(res.data.project.status_build);
    }

    if (projectInfo.value?.status === 0) return;
    handleGetProjectConfig();
    handleGetProjectComponentConfig();
  } catch (error: any) {
    toast.add({
      title: error.message,
      color: 'red',
    });
  } finally {
    isGetProjectLoading.value = false;
  }
};
handleGetProjectInfo();

const statusMenuBinding = computed(() => {
  const ICON = {
    [BUILD_STATUS.COMPLETE]: 'i-mdi-square-rounded-badge',
    [BUILD_STATUS.PROCESSING]: 'i-mdi-loading',
    [BUILD_STATUS.ERROR]: 'i-mdi-alert-circle-outline',
  };
  const ICON_CLASS = {
    [BUILD_STATUS.COMPLETE]: '',
    [BUILD_STATUS.PROCESSING]: 'animate-spin',
    [BUILD_STATUS.ERROR]: '!text-error',
  };
  return {
    icon: ICON[buildStatus.value],
    iconClass: ICON_CLASS[buildStatus.value],
  };
});

const links = computed(() => [
  {
    label: 'Dashboard',
    to: {
      name: 'organization-organizationId-projects-id-dashboard',
    },
    icon: 'i-mdi-monitor-dashboard',
  },
  {
    label: 'Pages',
    to: {
      name: 'organization-organizationId-projects-id-pages',
    },
    icon: 'i-mdi-view-carousel',
  },
  {
    label: 'Data',
    to: {
      name: 'organization-organizationId-projects-id-data',
    },
    icon: 'i-mdi-chart-donut',
  },
  ...collectionChildren.value,
  {
    label: 'Status',
    to: {
      name: 'organization-organizationId-projects-id-status',
    },
    ...statusMenuBinding.value,
  },
  {
    label: 'Files',
    to: {
      name: 'organization-organizationId-projects-id-files',
    },
    icon: 'i-mdi-file-multiple',
  },
  {
    label: 'Settings',
    to: {
      name: 'organization-organizationId-projects-id-settings',
    },
    icon: 'i-mdi-cog',
  },
]);

const handleReadLogRealtime = async () => {
  try {
    projectStore.clearBuildLog();
    const res: any = (await API.readLogRealTime({
      project_id: Number(route.params.id),
      is_pending: true,
    })) as any;
    projectStore.setBuildLog(res);
  } catch (error) {
    console.error(error);
  }
};

const isDeploySuccess = ref(false);
const modalLogBuildRef = ref();
const mqttHandler = (eventType: string | number) => {
  switch (eventType) {
    case EVENT_TYPE.BUILD_START:
    case BUILD_STATUS.PROCESSING:
      buildStatus.value = BUILD_STATUS.PROCESSING;
      toast.remove(EVENT_TYPE.BUILD_START);
      toast.add({
        id: EVENT_TYPE.BUILD_START,
        ui: {
          icon: {
            base: 'animate-spin',
          },
        },
        icon: 'i-mdi-loading',
        title: 'Building...',
        color: 'primary',
        timeout: 0,
        click: () => modalLogBuildRef.value?.show(),
        actions: [
          {
            label: 'View output',
            color: 'primary',
            class: 'pointer-events-none',
          },
        ] as any,
      });
      break;
    case EVENT_TYPE.BUILD_COMPLETE:
    case BUILD_STATUS.COMPLETE:
      buildStatus.value = BUILD_STATUS.COMPLETE;
      toast.remove(EVENT_TYPE.BUILD_START);
      if (projectInfo.value?.status === 0) {
        isDeploySuccess.value = true;
        setTimeout(() => {
          isDeploySuccess.value = false;
          handleGetProjectInfo();
        }, 2000);
        return;
      }
      handleGetProjectInfo();
      break;
    case EVENT_TYPE.BUILD_ERROR:
    case BUILD_STATUS.ERROR:
      buildStatus.value = BUILD_STATUS.ERROR;
      toast.remove(EVENT_TYPE.BUILD_START);
      toast.add({
        icon: 'i-mdi-alert-circle-outline',
        title: 'Build error',
        color: 'red',
        timeout: 0,
      });
      break;
    case EVENT_TYPE.LOG_CHANGE:
      handleReadLogRealtime();
      break;
  }
};

const mqttClient = inject('mqttClient') as MqttClient;
const mqttListener = (_: string, payload: Buffer) => {
  const payloadParsed = tryParseJson(payload.toString());
  const eventType = payloadParsed?.event_type;
  if (payloadParsed?.project_id !== Number(route.params.id)) return;
  mqttHandler(eventType);
};

onMounted(() => {
  mqttClient.on('message', mqttListener);
});

onBeforeUnmount(() => {
  mqttClient.removeListener('message', mqttListener);
});
</script>

<style scoped></style>
