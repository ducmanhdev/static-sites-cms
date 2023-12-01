<template>
  <div class="mb-6 flex items-center gap-2">
    <UButton icon="i-mdi-folder" variant="ghost" color="black" label="Files" @click="handleBackToRootFolder" />
    <template v-for="folder in dir" :key="folder">
      <UIcon name="i-mdi-chevron-left" class="text-2xl" />
      <UButton icon="i-mdi-folder" :label="folder" variant="ghost" color="black" @click="handleBackToFolder(folder)" />
    </template>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string[];
}

const props = defineProps<Props>();

interface Emits {
  (e: 'update:modelValue', newValue: string[]): void;
}

const emits = defineEmits<Emits>();

const dir = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emits('update:modelValue', newValue);
  },
});

const handleBackToFolder = (folderName: string) => {
  const existFolderIndex = dir.value.findIndex((folder) => folder === folderName);
  if (existFolderIndex === -1) return;
  dir.value.length = existFolderIndex + 1;
};
const handleBackToRootFolder = () => {
  dir.value.length = 0;
};
</script>

<style scoped></style>
