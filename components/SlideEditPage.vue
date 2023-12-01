<template>
  <USlideover
    v-model="isOpen"
    prevent-close
    :ui="{
      base: isEditPage ? 'grid grid-cols-[1fr_2fr]' : undefined,
      width: isEditPage ? 'w-screen max-w-10xl' : 'w-screen max-w-5xl',
    }"
  >
    <UCard
      class="flex flex-col flex-1"
      :ui="{
        body: { base: 'flex-1 overflow-y-auto' },
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-2xl font-semibold">Preview</h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" size="xl" @click="hide" />
        </div>
      </template>
      <template #default>
        <div class="min-h-full grid grid-cols-1 gap-6">
          <UCard
            :ui="{
              body: {
                base: 'h-full relative',
                padding: 'p-6',
              },
            }"
          >
            <BaseLoading v-if="isReadCollectionLoading" class="h-full" />
            <BaseError v-else-if="readCollectionError" :message="readCollectionError" />
            <BaseEmpty v-else-if="!pageData" />
            <SlideEditPageLayer v-else v-model="pageData" />
          </UCard>
        </div>
      </template>
      <template #footer>
        <div class="text-center grid grid-cols-2 gap-6">
          <UButton color="red" variant="outline" block @click="hide">Cancel</UButton>
          <UButton color="primary" block :disabled="isNoChange" :loading="isSaveLoading" @click="handleSave">
            Save
          </UButton>
        </div>
      </template>
    </UCard>
    <UCard
      v-if="isEditPage"
      class="flex flex-col flex-1"
      :ui="{
        body: { base: 'flex-1 overflow-y-auto' },
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <!--            <iframe ref="iframeEl" src="http://192.168.1.145:3002" class="block w-full h-screen"></iframe>-->
      <iframe ref="iframeEl" :src="reviewSrc" class="block w-full h-screen dark:bg-gray-800"></iframe>
    </UCard>
  </USlideover>
  <ModalConfirm ref="modalConfirmRef" />
</template>

<script setup lang="ts">
import type { IPageData } from '@/types';

const route = useRoute();
const toast = useToast();
const projectStore = useProjectStore();

const ORIGIN_PAGE_DATA_KEY = 'ORIGIN_PAGE_DATA_KEY';

const isOpen = ref(false);
const pageData = ref<IPageData | null>(null);
const isNoChange = computed(() => JSON.stringify(pageData.value) === localStorage.getItem(ORIGIN_PAGE_DATA_KEY));

const isReadCollectionLoading = ref(false);
const readCollectionError = ref<string | null>(null);
const currentPath = ref('');
const currentCollection = ref('');
const reviewSrc = computed(() => {
  const sub = (currentPath.value || '').replace('index.yml', '').replace('.yml', '');
  return `${projectStore.projectInfo.domain_stable}/${sub}`;
});
const isEditPage = computed(() => currentCollection.value === 'pages');
const show = async ({ path, collection }: { path: string; collection: string }) => {
  try {
    if (!path || !collection) {
      throw new Error('Path or collection is not valid');
    }
    currentPath.value = path;
    currentCollection.value = collection;
    pageData.value = null;
    readCollectionError.value = null;
    isReadCollectionLoading.value = true;
    isOpen.value = true;
    const res: any = await API.readCollection({
      project_id: Number(route.params.id),
      sub_path: path,
      collection,
    });
    pageData.value = res;
    localStorage.setItem(ORIGIN_PAGE_DATA_KEY, JSON.stringify(res));
  } catch (error: any) {
    readCollectionError.value = error.message;
  } finally {
    isReadCollectionLoading.value = false;
  }
};

const modalConfirmRef = ref();
const hide = async () => {
  if (isNoChange.value) {
    isOpen.value = false;
    return;
  }
  await modalConfirmRef.value.show('Are you sure want to discard all changes?');
  localStorage.removeItem(ORIGIN_PAGE_DATA_KEY);
  isOpen.value = false;
};

const isSaveLoading = ref(false);
const handleSave = async () => {
  try {
    isSaveLoading.value = true;
    const file = stringToFile(JSON.stringify(pageData.value));
    await API.editPage({
      file,
      project_id: Number(route.params.id),
      path_file: `${projectStore?.config?.collections_config?.[currentCollection.value]?.path}/${currentPath.value}`,
    });
    localStorage.removeItem(ORIGIN_PAGE_DATA_KEY);
    isOpen.value = false;
    toast.add({
      color: 'green',
      title: 'Save successfully',
    });
  } catch (error: any) {
    toast.add({
      color: 'red',
      title: error.message,
    });
  } finally {
    isSaveLoading.value = false;
  }
};

const iframeEl = ref();
const handleEmitEvent = (newPageData: any) => {
  try {
    if (!newPageData) return;
    if (!iframeEl.value) return;
    iframeEl.value.contentWindow?.postMessage(
      {
        type: 'newzen:update',
        data: JSON.stringify(newPageData),
      },
      '*',
    );
  } catch (error) {
    console.log('handleEmitEvent error: ', error);
  }
};
watch(pageData, handleEmitEvent, {
  deep: true,
});
defineExpose({
  show,
  hide,
});
</script>

<style scoped></style>
