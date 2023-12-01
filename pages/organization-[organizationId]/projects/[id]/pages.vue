<template>
  <section>
    <h2 class="main-title">Pages</h2>
    <Browser
      v-model:sort="sortSelected"
      v-model:search="search"
      :sort-options="sortOptions"
      :button-dropdown-items="createDropdownItems"
    />
    <BaseEmpty v-if="!isGetItemsLoading && !itemsFiltered?.length" />
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <template v-if="isGetItemsLoading">
        <BlockItemSkeleton v-for="item in 10" :key="item" />
      </template>
      <template v-else-if="itemsFiltered?.length">
        <BlockItem
          v-for="item in itemsFiltered"
          :key="item.sub_path"
          icon="i-mdi-application-outline"
          :title="item.sub_path"
          :dropdown-items="pageDropdownItems(item.sub_path)"
          @click="handlePreviewPage(item.sub_path)"
        />
      </template>
    </div>
    <SlideEditPage ref="slideEditPageRef" />
  </section>
</template>

<script setup lang="ts">
const COLLECTION = 'pages';
const route = useRoute();
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
const createDropdownItems = [
  [
    {
      label: 'Create page',
      icon: 'i-mdi-file-plus',
    },
    {
      label: 'Create folder',
      icon: 'i-mdi-folder-plus-outline',
    },
  ],
];

const pageDropdownItems = (path: string) => {
  return [
    [
      {
        label: 'Open page',
        icon: 'i-mdi-folder-open',
        click: () => handlePreviewPage(path),
      },
    ],
    [
      {
        label: 'Move to folder',
        icon: 'i-mdi-folder-arrow-left-right',
      },
      {
        label: 'Rename folder',
        icon: 'i-mdi-rename',
      },
    ],
    [
      {
        label: 'Delete page',
        icon: 'i-mdi-delete',
      },
    ],
  ];
};

const slideEditPageRef = ref();
const handlePreviewPage = (path: string) => {
  slideEditPageRef.value?.show({
    collection: COLLECTION,
    path,
  });
};

interface Item {
  sub_path: string;
}

const items = ref<Item[]>([]);
const itemsFiltered = computed(() => {
  if (!items.value?.length) return [];
  return items.value
    .filter((item) => item.sub_path.includes(search.value))
    .sort((a, b) => {
      if (sortSelected.value.value === 'title') {
        return a.sub_path.localeCompare(b.sub_path);
      }
      if (sortSelected.value.value === '-title') {
        return b.sub_path.localeCompare(a.sub_path);
      }
      return 0;
    });
});
const isGetItemsLoading = ref(false);
const handleGetItems = async () => {
  try {
    isGetItemsLoading.value = true;
    const res: any = await API.getPathCollection({
      project_id: Number(route.params.id),
      collection: COLLECTION,
    });
    items.value = res.data;
  } catch (error: any) {
    toast.add({
      title: error.message,
      color: 'red',
    });
  } finally {
    isGetItemsLoading.value = false;
  }
};
handleGetItems();
</script>

<style scoped></style>