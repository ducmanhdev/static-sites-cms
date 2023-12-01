<template>
  <section>
    <h2 class="main-title">Data</h2>
    <Browser v-model:sort="sortSelected" v-model:search="search" :sort-options="sortOptions" :button-visible="false" />
    <BaseEmpty v-if="!isGetItemsLoading && !itemsFiltered?.length" />
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <template v-if="isGetItemsLoading">
        <BlockItemSkeleton v-for="item in 10" :key="item" />
      </template>
      <template v-else-if="itemsFiltered?.length">
        <BlockItem
          v-for="item in itemsFiltered"
          :key="item.sub_path"
          icon="i-mdi-cog"
          :title="item.sub_path"
          @click="handlePreviewPage(item.sub_path)"
        />
      </template>
    </div>
    <SlideEditPage ref="slideEditPageRef" />
  </section>
</template>

<script setup lang="ts">
const COLLECTION = 'data';
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

const slideEditPageRef = ref();
const handlePreviewPage = (path: string) => {
  slideEditPageRef.value?.show({
    collection: COLLECTION,
    path,
  });
};
</script>

<style scoped></style>
