<template>
  <UCard
    class="cursor-pointer"
    :ui="{
      body: {
        padding: 'p-0 sm:p-0',
      },
    }"
  >
    <div class="grid grid-cols-[200px_1fr] items-center">
      <div class="self-stretch">
        <NuxtImg :src="thumbnail" placeholder loading="lazy" class="w-full h-full object-cover" />
      </div>
      <div class="p-4 space-y-1">
        <p class="font-semibold break-word line-clamp-1">{{ title }}</p>
        <p class="text-gray-500 flex items-center gap-2">
          <UIcon name="i-mdi-sitemap" />
          <span>{{ '3 sites' }}</span>
        </p>
        <p class="text-gray-500 flex items-center gap-2">
          <UIcon name="i-mdi-earth" />
          <span>{{ '0 domain' }}</span>
        </p>
        <p class="text-gray-500 flex items-center gap-2">
          <UIcon name="i-mdi-currency-usd" />
          <span>{{ 'Standard plan' }}</span>
        </p>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Props {
  icon?: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  dropdownItems?: any[];
}

withDefaults(defineProps<Props>(), {
  icon: 'i-mdi-information',
  title: 'Organization name',
  description: '',
  thumbnail: 'https://placehold.co/600x400',
  dropdownItems: () => [],
});
</script>

<style scoped></style>
