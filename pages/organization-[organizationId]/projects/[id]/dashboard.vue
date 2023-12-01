<template>
  <section>
    <h2 class="main-title lg:mb-8">Dashboard</h2>
    <UTabs v-model="currentTabIndex" :items="tabItems" class="w-full" :ui="{ wrapper: 'space-y-4' }">
      <template #default="{ item, selected }">
        <div class="flex items-center gap-2 relative truncate">
          <UIcon :name="item.icon" class="w-4 h-4 flex-shrink-0" />
          <span class="truncate">{{ item.label }}</span>
          <span v-if="selected" class="absolute -right-4 w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400" />
        </div>
      </template>
      <template #summary>
        <div class="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 md:gap-10">
          <div>
            <h3 class="sub-title">Live URL</h3>
            <UButtonGroup orientation="horizontal" class="grid grid-cols-[auto_1fr] mb-6">
              <UButton color="gray" icon="i-mdi-lock" />
              <UButton
                color="gray"
                variant="solid"
                :label="projectInfo?.domain_stable || 'N/A'"
                :to="projectInfo?.domain_stable"
                target="_blank"
                external
                trailing-icon="i-mdi-arrow-top-right-bold-box"
                class="justify-between"
              />
            </UButtonGroup>
            <SitePreview />
          </div>
          <div>
            <h3 class="sub-title">Recent activity</h3>
            <div class="space-y-4">
              <template v-if="isGetActivitiesLoading">
                <UCard v-for="item in LIMIT_ACTIVITIES_COUNT" :key="item">
                  <div class="flex items-center gap-4">
                    <USkeleton class="h-8 w-8" :ui="{ rounded: 'rounded-full' }" />
                    <div class="grow space-y-2">
                      <USkeleton class="h-4" />
                      <USkeleton class="h-4" />
                      <USkeleton class="h-4" />
                    </div>
                  </div>
                </UCard>
              </template>
              <BaseEmpty v-else-if="!listActivities?.length" />
              <template v-else>
                <RecentActivityItem
                  v-for="activity in listActivities"
                  :key="activity.id"
                  :created-at="activity.created_at"
                  :data="activity.data"
                  :user="activity.user"
                  @click="handleShowDiffModal(activity.id)"
                />
                <UButton type="button" block @click="handleSeeMoreActivities">See more</UButton>
              </template>
            </div>
          </div>
        </div>
      </template>
      <template #activity>
        <LazyProjectActivities />
      </template>
    </UTabs>
    <ModalDiff ref="modelDiffRef" />
  </section>
</template>

<script setup lang="ts">
const toast = useToast();
const route = useRoute();
const projectStore = useProjectStore();
const projectInfo = computed(() => projectStore.projectInfo);
const tabItems = [
  {
    slot: 'summary',
    label: 'Summary',
    icon: 'i-mdi-card-text',
  },
  {
    slot: 'activity',
    label: 'Activity',
    icon: 'i-mdi-archive-clock',
  },
];
const currentTabIndex = ref(0);

const LIMIT_ACTIVITIES_COUNT = 5;
const listActivities = ref<any>();
const isGetActivitiesLoading = ref(false);
const handleGetActivities = async () => {
  try {
    isGetActivitiesLoading.value = true;
    const res: any = await API.getActivities({
      project_id: Number(route.params.id),
    });
    listActivities.value = res.data.items.slice(0, LIMIT_ACTIVITIES_COUNT);
  } catch (error: any) {
    toast.add({
      title: error.title,
      color: 'red',
    });
  } finally {
    isGetActivitiesLoading.value = false;
  }
};
handleGetActivities();
const handleSeeMoreActivities = () => {
  currentTabIndex.value = 1;
};

const modelDiffRef = ref();
const handleShowDiffModal = (activityId: number) => {
  modelDiffRef.value.show(activityId);
};
</script>

<style scoped></style>
