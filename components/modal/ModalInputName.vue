<template>
  <UModal v-model="isOpen">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold">{{ modalTitle }}</h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="isOpen = false"
          />
        </div>
      </template>
      <UForm :state="state" @submit="handleSubmit">
        <UFormGroup v-slot="{ error }" label="Name" :error="isInvalidName" required>
          <UInput
            v-model="state.name"
            :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : ''"
            @input="handleClearValidate"
          />
        </UFormGroup>
      </UForm>
      <template #footer>
        <div class="text-center grid grid-cols-2 gap-6">
          <UButton color="red" variant="outline" block @click="hide">Cancel</UButton>
          <UButton color="primary" block @click="handleSubmit">OK</UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const isInvalidName = ref<string | null>(null);
const handleClearValidate = () => {
  isInvalidName.value = null;
};

const handleSubmit = () => {
  isInvalidName.value = validateSchema(state.value.name);
  if (isInvalidName.value) return;
  handleResolve(state.value.name);
  hide();
};

const modalTitle = ref('');
const state = ref({ name: '' });
let validateSchema: (name: string) => string;
let handleResolve: (value: unknown) => void;
const isOpen = ref(false);

interface IShowOptions {
  modalTitle: string;
  name?: string;
  validateSchema?: (name: string) => string;
}

const show = (options: IShowOptions) => {
  return new Promise((resolve) => {
    modalTitle.value = options.modalTitle;
    state.value.name = options.name || '';
    validateSchema =
      options.validateSchema ||
      ((name: string) => {
        if (!name) return 'Name is required';
        return '';
      });
    handleResolve = resolve;
    handleClearValidate();
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
