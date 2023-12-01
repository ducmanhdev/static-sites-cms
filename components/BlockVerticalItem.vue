<template>
  <UCard
    class="cursor-pointer"
    :ui="{
      body: {
        padding: 'p-0 sm:p-0 h-full',
      },
    }"
  >
    <div class="relative">
      <div class="aspect-w-3 aspect-h-2">
        <NuxtImg :src="thumbnail" placeholder loading="lazy" />
      </div>
      <div class="p-4 absolute top-0 right-0">
        <UDropdown v-if="dropdownItems?.length" :items="dropdownItems" @click.stop>
          <UButton icon="i-mdi-drag-horizontal-variant" class="shrink-0 button-drag" variant="ghost" color="gray" />
        </UDropdown>
      </div>
    </div>
    <div class="flex gap-4 p-4">
      <div class="w-[30px] shrink-0 flex justify-between">
        <slot name="icon">
          <UIcon :name="icon" class="text-3xl" />
        </slot>
      </div>
      <div class="grow">
        <p class="font-semibold break-word line-clamp-1 mb-0.5">{{ title }}</p>
        <p class="text-gray-500">{{ description }}</p>
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
  title: '',
  description: '',
  thumbnail: 'https://placehold.co/600x400',
  dropdownItems: () => [],
});
</script>

<style scoped></style>
