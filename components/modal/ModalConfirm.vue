<template>
  <UModal v-model="isOpen">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold">Confirm</h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="isOpen = false"
          />
        </div>
      </template>
      <h2 class="text-2xl font-semibold text-center">{{ message }}</h2>
      <template #footer>
        <div class="text-center grid grid-cols-2 gap-6">
          <UButton color="red" variant="outline" block @click="hide">Cancel</UButton>
          <UButton color="primary" block @click="handleResolve">Confirm</UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const isOpen = ref(false);

let handleResolve: () => void;
const message = ref();
const show = (_message: string) => {
  return new Promise((resolve) => {
    message.value = _message;
    handleResolve = () => {
      resolve(null);
      isOpen.value = false;
    };
    isOpen.value = true;
  });
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
