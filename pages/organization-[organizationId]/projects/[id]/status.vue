<template>
  <section>
    <h2 class="main-title">Status</h2>
    <UTabs :items="tabItems" class="w-full">
      <template #default="{ item, selected }">
        <div class="flex items-center gap-2 relative truncate">
          <UIcon :name="item.icon" class="w-4 h-4 flex-shrink-0" />
          <span class="truncate">{{ item.label }}</span>
          <span v-if="selected" class="absolute -right-4 w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400" />
        </div>
      </template>
      <template #summary>Summary</template>
      <template #sync>Sync</template>
      <template #log>
        <LazyTerminalLogBuild />
      </template>
    </UTabs>
  </section>
</template>

<script setup lang="ts">
const tabItems = [
  {
    slot: 'summary',
    label: 'Summary',
    icon: 'i-mdi-card-text',
  },
  {
    slot: 'sync',
    label: 'Sync',
    icon: 'i-mdi-cloud-sync',
  },
  {
    slot: 'log',
    label: 'Log',
    icon: 'i-mdi-clipboard-text-clock',
  },
];
</script>

<style scoped></style>
