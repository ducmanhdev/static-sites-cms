<template>
  <UModal v-model="isOpen">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold">Enter OTP</h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="isOpen = false"
          />
        </div>
      </template>
      <div class="grid grid-cols-6 justify-center gap-4">
        <UInput
          v-for="(_, index) in 6"
          :key="index"
          ref="otpInputRefs"
          :model-value="otpArr[index]"
          :ui="{
            base: 'text-center',
          }"
          @keydown.prevent="($event) => handleInputKeydown($event, index)"
        />
      </div>
      <template #footer>
        <div class="text-center grid grid-cols-2 gap-6">
          <UButton color="red" variant="outline" block @click="hide">Cancel</UButton>
          <UButton color="primary" block :disabled="isDisabledConfirmButton" @click="handleResolve">Confirm</UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { UInput } from '#components';

const isOpen = ref(false);
const otpArr = ref<string[]>([]);
const otpInputRefs = ref<InstanceType<typeof UInput>[]>([]);
const isDisabledConfirmButton = computed(() => otpArr.value.filter((item) => Number(item)).length < 6);
const handleInputKeydown = (event: any, index: number) => {
  const prevInputElement = otpInputRefs.value?.[index - 1]?.input;
  const currentInputElement = otpInputRefs.value?.[index]?.input;
  const nextInputElement = otpInputRefs.value?.[index + 1]?.input;
  const key = event.key;
  const isBackspace = key === 'Backspace';
  const isNumeric = !!Number(event.key);
  if (isBackspace) {
    otpArr.value[index] = '';
    prevInputElement?.focus();
  }
  if (isBackspace || !isNumeric) {
    event.preventDefault();
    return false;
  }
  otpArr.value[index] = key;
  nextInputElement ? nextInputElement?.focus() : currentInputElement?.blur();
};

let handleResolve: () => void;
const show = () => {
  return new Promise((resolve) => {
    handleResolve = () => {
      resolve(otpArr.value.join(''));
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
