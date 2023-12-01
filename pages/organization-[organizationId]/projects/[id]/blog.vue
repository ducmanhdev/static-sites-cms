<template>
  <section>
    <h2 class="main-title">Blog</h2>
    <Browser v-model:sort="sortSelected" v-model:search="search" :sort-options="sortOptions" />
    <div class="grid grid-cols-4 gap-6">
      <BlockVerticalItem
        v-for="post in blog"
        :key="post._path"
        icon="i-mdi-blog"
        :title="post.title"
        :description="post._path"
        @click="handlePreviewPage(post._path)"
      />
    </div>
    <SlideEditPage ref="slideEditPageRef" />
  </section>
</template>

<script setup lang="ts">
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

const { data: blog } = await useAsyncData('blog', () =>
  queryContent()
    .where({
      _partial: false,
      _path: /^\/blog/,
    })
    .find(),
);
const slideEditPageRef = ref();
const handlePreviewPage = (path: string) => {
  slideEditPageRef.value.show(path);
};
</script>

<style scoped></style>
