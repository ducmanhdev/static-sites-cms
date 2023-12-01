<template>
  <div class="grid grid-cols-[40px_1fr] mb-4">
    <UInput
      v-model="value"
      type="color"
      :ui="{
        base: 'h-full',
        padding: {
          '2xs': 'p-0',
          xs: 'p-0',
          sm: 'p-0',
          md: 'p-0',
          lg: 'p-0',
          xl: 'p-0'
        },
        rounded: 'rounded-none rounded-l-md'
      }"
    />
    <UInput
      ref="inputRef"
      :model-value="value"
      :ui="{ base: 'h-full', rounded: 'rounded-none rounded-r-md' }"
      @blur="handleUpdateValue"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'update:modelValue', value: string): void;
}

const emits = defineEmits<Emits>();
const value = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emits('update:modelValue', newValue);
  },
});

const inputRef = ref();
const handleUpdateValue = () => {
  const input = inputRef.value.input;
  const isValidColor = /^#[0-9A-F]{6}[0-9a-f]{0,2}$/i.test(input.value);
  if (isValidColor) {
    value.value = input.value;
    return;
  }
  input.value = value.value;
};
</script>

<style lang="scss" scoped>
:deep {
  input[type='color']::-webkit-color-swatch-wrapper {
    padding: 0;
    border-radius: inherit;
  }

  input[type='color']::-webkit-color-swatch {
    border: 0;
    border-radius: inherit;
    margin: 1px 0 1px 1px;
  }
}
</style>
