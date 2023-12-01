<template>
  <UModal v-model="isOpen" fullscreen>
    <UCard
      :ui="{
        ring: '',
        base: 'h-full flex flex-col',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        body: { base: 'grow overflow-y-auto' },
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold">Template</h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="isOpen = false"
          />
        </div>
      </template>
      <USelectMenu
        v-model="categorySelected"
        :options="listCategory"
        :loading="isGetListCategoryLoading"
        multiple
        option-attribute="name"
        placeholder="Filter by category"
        class="mb-6"
        @change="handleGetTemplate"
      />
      <div v-if="categorySelected?.length" class="mb-6 flex flex-wrap gap-2">
        <UBadge class="cursor-pointer" @click="handleRemoveAllCategory">
          Remove all
          <UIcon name="i-mdi-close" class="ml-2" />
        </UBadge>
        <UBadge
          v-for="cate in categorySelected"
          :key="cate.id"
          variant="outline"
          class="cursor-pointer"
          @click="handleRemoveCategory(cate.id)"
        >
          {{ cate.name }}
          <UIcon name="i-mdi-close" class="ml-2" />
        </UBadge>
      </div>
      <BaseLoading v-if="isGetTemplateLoading" class="h-full" />
      <BaseError v-else-if="getTemplateError" :message="getTemplateError" />
      <div v-else-if="listTemplate?.length" class="grid grid-cols-3 gap-6">
        <TemplateItem
          v-for="template in listTemplate"
          :key="template.id"
          :image="template.thumbnail"
          :image-alt="template.name"
          :title="template.name"
          :categories="template.categories.map((category) => category.name)"
          @click="handleViewTemplate(template.id)"
        />
      </div>
    </UCard>

    <ModalViewTemplate ref="modalViewTemplateRef" @create-success="handleCreateTemplateSuccess" />
  </UModal>
</template>

<script setup lang="ts">
const toast = useToast();

interface ICategory {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

const categorySelected = ref<ICategory[]>([]);
const listCategory = ref<ICategory[]>([]);
const isGetListCategoryLoading = ref(false);
const handleGetListCategory = async () => {
  try {
    isGetListCategoryLoading.value = true;
    const res: any = await API.getListCategory();
    listCategory.value = res?.data?.categories || [];
  } catch (error: any) {
    toast.add({
      title: error.message,
      color: 'red',
    });
  } finally {
    isGetListCategoryLoading.value = false;
  }
};
const handleRemoveCategory = (categoryId: number) => {
  categorySelected.value = categorySelected.value.filter((category: ICategory) => category.id !== categoryId);
};
const handleRemoveAllCategory = () => {
  categorySelected.value = [];
};

const isGetTemplateLoading = ref(false);
const getTemplateError = ref<null | string>(null);
const listTemplate = ref([]);
const handleGetTemplate = async () => {
  try {
    isGetTemplateLoading.value = true;
    getTemplateError.value = null;
    const res: any = await API.getListTemplate({
      list_categories: categorySelected.value.map((category: ICategory) => category?.slug),
    });
    listTemplate.value = res?.data?.items || [];
  } catch (error: any) {
    getTemplateError.value = error.message;
  } finally {
    isGetTemplateLoading.value = false;
  }
};

const modalViewTemplateRef = ref();
const handleViewTemplate = (templateId: number) => {
  modalViewTemplateRef.value?.show(templateId);
};

const handleCreateTemplateSuccess = (createdProjectId: number) => {
  isOpen.value = false;
  navigateTo({
    name: 'organization-organizationId-projects-id',
    params: {
      id: createdProjectId,
    },
  });
};

const isOpen = ref(false);
const show = () => {
  isOpen.value = true;
  handleGetTemplate();
  handleGetListCategory();
};
const hide = () => {
  isOpen.value = false;
};
defineExpose({
  show,
  hide,
});
</script>

<style scoped></style>
