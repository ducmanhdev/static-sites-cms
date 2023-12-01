<template>
  <UCard
    class="cursor-pointer"
    :ui="{
      body: {
        padding: 'p-4 sm:p-4 h-full',
      },
    }"
  >
    <div class="flex items-center gap-4 h-ful min-h-[48px]">
      <div class="w-[30px] shrink-0 flex items-center justify-between">
        <slot name="icon">
          <UIcon :name="icon" class="text-3xl" />
        </slot>
      </div>
      <div class="grow">
        <p class="font-semibold break-word line-clamp-1">{{ title }}</p>
        <p class="text-gray-500">{{ description }}</p>
      </div>
      <UDropdown v-if="dropdownItems?.length || showButtonDrag" :items="dropdownItems" @click.stop>
        <UButton icon="i-mdi-drag-horizontal-variant" class="shrink-0 button-drag" variant="ghost" color="gray" />
      </UDropdown>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Props {
  icon?: string;
  title?: string;
  description?: string;
  showButtonDrag?: boolean;
  dropdownItems?: any[];
}

withDefaults(defineProps<Props>(), {
  icon: 'i-mdi-information',
  title: '',
  description: '',
  showButtonDrag: false,
  dropdownItems: () => [],
});
</script>

<style scoped></style>
