<template>
  <section>
    <h2 class="main-title">Projects</h2>
    <Browser
      v-model:sort="sortSelected"
      v-model:search="search"
      :sort-options="sortOptions"
      @button-click="handleShowModalPickTemplate"
    />
    <BaseLoading v-if="isGetListProjectLoading" />
    <BaseError v-else-if="getListProjectError" :message="getListProjectError.message" />
    <BaseEmpty v-else-if="!data?.items?.length" />
    <template v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <ProjectItem
          v-for="project in data.items"
          :id="project.id"
          :key="project.id"
          :code="project.code"
          :link="project.source_path"
          :title="project.name"
          :image-alt="project.name"
          :build-time="project.build_lasted_at"
          :synced-time="project.async_lasted_at"
          :log-id-last="project.log_id_last"
        />
      </div>
      <div class="mt-4 flex justify-center">
        <UPagination
          :page-count="data._meta.perPage"
          :total="data._meta.totalCount"
          :model-value="data._meta.currentPage"
          @update:model-value="handleGetListProject"
        />
      </div>
    </template>

    <ModalPickTemplate ref="modalPickTemplateRef" />
  </section>
</template>

<script setup lang="ts">
const route = useRoute();

const search = ref('');
const sortOptions = [
  {
    label: 'Size name',
    value: 'title',
  },
  {
    label: 'Size name (Z-A)',
    value: '-title',
  },
  {
    label: 'Sync provider',
    value: 'sync_provider',
  },
  {
    label: 'Domain',
    value: 'domain',
  },
  {
    label: 'Domain (Z-A)',
    value: '-domain',
  },
];
const sortSelected = ref(sortOptions[0]);

const data = ref<any>();
const getListProjectError = ref<any>(null);
const isGetListProjectLoading = ref(false);
const handleGetListProject = async (page: number = 1) => {
  try {
    getListProjectError.value = null;
    isGetListProjectLoading.value = true;
    const res: any = await API.getListProject({
      organization_id: Number(route.params.organizationId),
      page,
      'per-page': 8,
    });
    data.value = res.data;
  } catch (error: any) {
    getListProjectError.value = error;
  } finally {
    isGetListProjectLoading.value = false;
  }
};
handleGetListProject();

const modalPickTemplateRef = ref();
const handleShowModalPickTemplate = () => {
  modalPickTemplateRef.value?.show();
};
</script>

<style scoped></style>
