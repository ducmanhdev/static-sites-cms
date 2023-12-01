<template>
  <div class="space-y-4">
    <template v-if="isGetActivitiesLoading">
      <UCard v-for="item in ITEMS_PER_PAGE" :key="item">
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
    <BaseEmpty v-else-if="!activityData?.items?.length" />
    <template v-else>
      <RecentActivityItem
        v-for="activity in activityData?.items"
        :key="activity.id"
        :created-at="activity.created_at"
        :data="activity.data"
        :user="activity.user"
        @click="handleShowDiffModal(activity.id)"
      />
      <div class="mt-4 flex justify-center">
        <UPagination
          :page-count="activityData?._meta?.perPage || 1"
          :total="activityData?._meta?.totalCount || 1"
          :model-value="activityData?._meta?.currentPage || 1"
          @update:model-value="handleGetActivities"
        />
      </div>
    </template>
    <ModalDiff ref="modelDiffRef" />
  </div>
</template>

<script setup lang="ts">
const toast = useToast();
const route = useRoute();
const activityData = ref<any>();
const isGetActivitiesLoading = ref(false);

const ITEMS_PER_PAGE = 5;
const handleGetActivities = async (page: number = 1) => {
  try {
    isGetActivitiesLoading.value = true;
    const res: any = await API.getActivities({
      project_id: Number(route.params.id),
      'per-page': ITEMS_PER_PAGE,
      page,
    });
    activityData.value = res.data;
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

const modelDiffRef = ref();
const handleShowDiffModal = (activityId: number) => {
  modelDiffRef.value.show(activityId);
};
</script>

<style scoped></style>
