<template>
  <UCard
    :ui="{
      body: {
        base: 'text-error text-center',
        background: 'bg-error/10',
        padding: 'p-4 sm:p-4',
      },
    }"
  >
    <UIcon name="i-mdi-alert-circle" class="text-4xl" />
    <p class="font-medium">{{ message }}</p>
  </UCard>
</template>

<script setup lang="ts">
defineProps<{
  message: string;
}>();
</script>

<style scoped></style>
