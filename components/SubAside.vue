<template>
  <aside class="bg-gray-200 dark:bg-gray-800 p-6">
    <h2 class="font-bold text-2xl mb-4">{{ title }}</h2>
    <UVerticalNavigation
      :links="links"
      :ui="{
          wrapper: 'space-y-1',
          base: 'text-lg py-2',
          active: 'before:bg-primary text-white',
          icon: {
            active: 'text-white'
          }
        }"
    />
  </aside>
</template>

<script setup lang="ts">
import type { VerticalNavigationLink } from "#ui/types";

interface Props {
  title: string;
  links: VerticalNavigationLink[];
}

withDefaults(
  defineProps<Props>(),
  {
    links: () => [],
  }
)
</script>

<style scoped>

</style>