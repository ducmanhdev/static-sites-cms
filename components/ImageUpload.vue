<template>
  <label class="border p-4 rounded block w-full cursor-pointer" @drop.prevent="handleDrop" @dragover.prevent>
    <input ref="inputRef" type="file" class="hidden" :accept="accept" @change="handleUploadFile" />
    <BaseLoading
      v-if="isGetImageLoading || isUploadFileLoading"
      title="Loading image"
      class="bg-white/50 absolute inset-0 h-full z-20"
    />
    <span v-if="imgSrc" class="group">
      <span
        class="flex justify-center items-center gap-3 absolute inset-0 bg-white/50 text-black transition opacity-0 group-hover:opacity-100 z-10"
      >
        <UButton
          type="button"
          color="red"
          @click.stop.prevent="handleRemoveInput"
        >
          Delete
        </UButton>
        <UButton
          type="button"
          class="pointer-events-none"
        >
          Change
        </UButton>
      </span>
      <span class="block aspect-w-16 aspect-h-9">
        <img :src="imgSrc" alt="" class="block rounded absolute inset-0 object-contain" />
      </span>
    </span>
    <span v-else class="p-4 border border-dashed flex flex-col text-center space-y-1">
      <img
        src="data:image/png;base64,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"
        alt=""
        class="w-12 h-auto mx-auto"
      />
      <span class="font-medium">Drag and drop file</span>
      <span class="text-xs">OR</span>
      <button
        type="button"
        class="rounded border border-primary bg-transparent text-primary self-center px-4 py-1.5 pointer-events-none"
      >
        Browse file
      </button>
    </span>
  </label>
</template>

<script setup lang="ts">
const route = useRoute();
const toast = useToast();

interface Props {
  accept?: string;
  modelValue: string;
}

const props = withDefaults(defineProps<Props>(), {
  accept: 'image/*',
});

interface Emits {
  (e: 'update:modelValue', value: any): void;
}

const emits = defineEmits<Emits>();

const inputRef = ref<HTMLInputElement>();
const imgSrc = ref();

const isGetImageLoading = ref(false);
const handleGetImage = async () => {
  try {
    isGetImageLoading.value = true;
    const res: any = await API.getPublicAsset({
      project_id: Number(route.params.id),
      path: `public${props.modelValue}`,
    });
    imgSrc.value = URL.createObjectURL(res);
  } catch (error: any) {
    toast.add({
      title: error.message,
      color: 'red',
    });
  } finally {
    isGetImageLoading.value = false;
  }
};

watch(
  () => props.modelValue,
  (newModelValue) => {
    if (newModelValue && isRelativePath(newModelValue)) {
      handleGetImage();
    } else {
      imgSrc.value = newModelValue;
    }
  },
  {
    immediate: true,
  },
);

const isUploadFileLoading = ref(false);
const handleUploadFile = async () => {
  try {
    const file = inputRef.value!.files?.[0];
    if (!file) return;
    isUploadFileLoading.value = true;
    const newSrc = await API.uploadAsset({
      path: file.name,
      project_id: Number(route.params.id),
      file,
    });
    emits('update:modelValue', newSrc);
  } catch (error: any) {
    toast.add({
      title: error.message,
      color: 'red',
    });
  } finally {
    isUploadFileLoading.value = false;
  }
};

// const handlePreviewFile = () => {
//   const file = inputRef.value!.files?.[0];
//   const reader = new FileReader();
//   reader.addEventListener(
//     'load',
//     () => {
//       imgSrc.value = reader.result;
//     },
//     false,
//   );
//   if (file) {
//     reader.readAsDataURL(file);
//   }
// };
const handleClearInput = () => {
  if (!inputRef.value) return;
  inputRef.value.value = '';
  inputRef.value.files = null;
};
const handleRemoveInput = () => {
  imgSrc.value = null;
  handleClearInput();
  emits('update:modelValue', '');
};
const handleDrop = (e: any) => {
  if (e.dataTransfer.items) {
    inputRef.value!.files = e.dataTransfer.items.filter((item: any) => item.kind === 'file');
  } else {
    inputRef.value!.files = e.dataTransfer.files;
  }
  handleUploadFile();
};
</script>

<style scoped></style>
