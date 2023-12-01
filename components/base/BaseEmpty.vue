<template>
  <UCard
    :ui="{
      body: {
        base: 'text-center',
        padding: 'p-4 sm:p-4',
      },
    }"
  >
    <img src="@/assets/images/empty.png" alt="" class="w-28 mx-auto mb-6" />
    <p class="font-medium">{{ message }}</p>
  </UCard>
</template>

<script setup lang="ts">
interface Props {
  message?: string;
}

withDefaults(defineProps<Props>(), {
  message: 'No data',
});
</script>

<style scoped></style>
