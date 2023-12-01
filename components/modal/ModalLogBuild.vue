<template>
  <UModal
    v-model="isOpen"
    :ui="{
      width: 'sm:max-w-6xl',
    }"
  >
    <UCard
      :ui="{
        ring: '',
        base: 'h-full flex flex-col',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        body: { base: 'grow' },
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold">Log</h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="isOpen = false"
          />
        </div>
      </template>
      <TerminalLogBuild />
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const isOpen = ref(false);
const show = () => {
  isOpen.value = true;
};
const hide = () => {
  isOpen.value = false;
};

defineExpose({
  show,
  hide,
});
</script>

<style scoped></style>
