<template>
  <UModal
    v-model="isOpen"
    :ui="{
      width: 'sm:max-w-6xl',
    }"
  >
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
          <h3 class="text-xl font-bold">{{ data?.name || 'N/A' }}</h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="isOpen = false"
          />
        </div>
      </template>
      <BaseLoading v-if="isGetDataLoading" />
      <BaseError v-else-if="getDataError" :title="getDataError.message" />
      <div v-else class="text-center">
        <div class="max-w-lg mx-auto mb-6">
          <div class="block aspect-w-3 aspect-h-2">
            <NuxtImg
              :src="data.thumbnail || 'https://placehold.co/600x400'"
              class="object-cover"
              :alt="data?.name || 'N/A'"
              placeholder
              loading="lazy"
            />
          </div>
        </div>
        <h3 class="sub-title mb-4">{{ data.name }}</h3>
        <div class="flex justify-center gap-2 mb-4">
          <UBadge v-for="category in data.categories" :key="category" color="primary" variant="outline">
            {{ category.name }}
          </UBadge>
        </div>
        <UButton type="button" :loading="isDeployLoading" @click="handleDeploy">Deploy to Newzen</UButton>
      </div>
    </UCard>

    <ModalInputName ref='modalInputNameRef' />
  </UModal>
</template>

<script setup lang="ts">
const route = useRoute();
const toast = useToast();

interface Emits {
  (e: 'create-success', projectId: number): () => void;
}

const emits = defineEmits<Emits>();

const data = ref<any>();
const getDataError = ref<any>(null);
const isGetDataLoading = ref(false);
const handleGetData = async (templateId: number) => {
  try {
    isGetDataLoading.value = true;
    const res: any = await API.viewTemplate({
      id: templateId,
    });
    data.value = res?.data?.template;
  } catch (error: any) {
    getDataError.value = error;
  } finally {
    isGetDataLoading.value = false;
  }
};

const modalInputNameRef = ref();
const isDeployLoading = ref(false);
const handleDeploy = async () => {
  try {
    const projectName = await modalInputNameRef.value?.show({
      modalTitle: 'Input project name',
    });
    isDeployLoading.value = true;
    const res: any = await API.createProject({
      name: projectName,
      template_id: data.value.id,
      organization_id: Number(route.params.organizationId),
    });
    toast.add({
      title: 'Create successfully',
      color: 'green',
    });
    emits('create-success', res?.data?.project?.id);
  } catch (error: any) {
    toast.add({
      title: error.message,
      color: 'red',
    });
  } finally {
    isDeployLoading.value = false;
  }
};

const isOpen = ref(false);
const show = (templateId: number) => {
  isOpen.value = true;
  handleGetData(templateId);
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
