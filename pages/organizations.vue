<template>
  <section>
    <h2 class="main-title">Organizations</h2>
    <Browser
      v-model:sort="sortSelected"
      v-model:search="search"
      :sort-options="sortOptions"
      :button-loading="isCreateOrganizationLoading"
      @button-click="handleShowAddOrganizationModal"
    />
    <BaseLoading v-if="isGetListOrganizationLoading" />
    <BaseEmpty v-else-if="!listOrganizationFiltered?.length" />
    <div v-else class="space-y-6">
      <OrganizationItem
        v-for="organization in listOrganizationFiltered"
        :key="organization.id"
        :title="organization.name"
        @click="handleSelectOrganization(organization.id)"
      />
      <div class="mt-4 flex justify-center">
        <UPagination
          :page-count="organizationData._meta?.perPage || 1"
          :total="organizationData._meta?.totalCount || 1"
          :model-value="organizationData._meta?.currentPage || 1"
          @update:model-value="handleGetListOrganization"
        />
      </div>
    </div>
    <ModalInputName ref="modalInputNameRef" />
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  alias: '/',
});

const toast = useToast();
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
];
const sortSelected = ref(sortOptions[0]);

const handleSelectOrganization = (organizationId: number) => {
  navigateTo({
    name: 'organization-organizationId',
    params: {
      organizationId,
    },
  });
};

const organizationData = ref<any>({});
const listOrganizationFiltered = computed(() => {
  if (!organizationData.value?.items?.length) return [];
  return organizationData.value.items
    .filter((item: any) => {
      return item.name.toLowerCase().includes(search.value.toLowerCase());
    })
    .sort((a: any, b: any) => {
      if (sortSelected.value.value === 'title') {
        return a.name.localeCompare(b.name);
      }
      if (sortSelected.value.value === '-title') {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });
});
const isGetListOrganizationLoading = ref(false);
const handleGetListOrganization = async (page: number = 1) => {
  try {
    organizationData.value = {};
    isGetListOrganizationLoading.value = true;
    const res: any = await API.getListOrganization({
      page,
      'per-page': 4,
    });
    organizationData.value = res.data;
  } catch (error: any) {
    toast.add({
      title: error.message,
      color: 'red',
    });
  } finally {
    isGetListOrganizationLoading.value = false;
  }
};
handleGetListOrganization();

const modalInputNameRef = ref();
const isCreateOrganizationLoading = ref(false);
const handleShowAddOrganizationModal = async () => {
  try {
    isCreateOrganizationLoading.value = true;
    const organizationName = await modalInputNameRef.value?.show({
      modalTitle: 'Input project name',
    });
    const res: any = await API.createOrganization({
      name: organizationName,
      status: 1,
    });
    // handleGetListOrganization();
    toast.add({
      title: 'Create organization successfully',
      color: 'green',
    });
    navigateTo({
      name: 'organization-organizationId',
      params: {
        organizationId: res?.data?.organization?.id,
      },
    });
  } catch (error: any) {
    toast.add({
      title: error.message,
      color: 'red',
    });
  } finally {
    isCreateOrganizationLoading.value = false;
  }
};
</script>

<style scoped></style>
