<template>
  <UCard
    class="cursor-pointer"
    :ui="{
      body: {
        padding: 0,
      },
    }"
  >
    <div class="block aspect-w-3 aspect-h-2">
      <NuxtImg
        :src="image || 'https://placehold.co/600x400'"
        class="object-cover"
        :alt="imageAlt || 'Image'"
        placeholder
        loading="lazy"
      />
    </div>
    <div class="grid grid-cols-2 items-start gap-6 px-4 py-5">
      <div>
        <h3 class="text-lg font-bold">{{ title }}</h3>
      </div>
      <div class="flex justify-end gap-2">
        <UBadge v-for="category in categories" :key="category" color="primary" variant="outline">{{ category }}</UBadge>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Props {
  image: any;
  imageAlt: string;
  title: string;
  categories: string[];
}

defineProps<Props>();
</script>

<style scoped></style>