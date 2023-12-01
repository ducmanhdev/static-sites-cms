<template>
  <USlideover
    v-model="isVisible"
    :prevent-close="isSaveLoading"
    :ui="{
      width: 'w-screen max-w-4xl',
    }"
  >
    <UCard
      class="flex flex-col flex-1"
      :ui="{
        body: { base: 'flex-1 overflow-y-auto !p-0' },
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-2xl font-semibold">{{ fileData?.extras_field?.name }}</h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" size="xl" @click="hide" />
        </div>
      </template>
      <template #default>
        <base-loading v-if="isGetFileContentLoading" class="h-full" />
        <base-error v-else-if="error" class="m-6" :message="error" />
        <div v-if="isMediaContent" class="p-6 flex justify-center items-center h-full">
          <NuxtImg :src="mediaContent" placeholder loading="lazy" />
        </div>
        <MonacoEditor v-else ref="editorRef" v-model="fileContent" class="h-full" :options="{theme: editorTheme}"/>
      </template>
      <template #footer>
        <div class="text-center grid grid-cols-2 gap-6">
          <UButton color="red" variant="outline" block :disabled="isSaveLoading" @click="hide">Cancel</UButton>
          <UButton color="primary" block :disabled="isMediaContent" :loading="isSaveLoading" @click="handleSave"
            >Save
          </UButton>
        </div>
      </template>
    </UCard>
  </USlideover>
</template>

<script setup lang="ts">
import type { File } from '@/types/file';
const colorMode = useColorMode();
const editorTheme = computed(() => (colorMode.preference === 'dark' ? 'vs-dark' : 'vs-light'));

const route = useRoute();
const editorRef = ref();
const toast = useToast();

const error = ref<null | string>(null);
const fileContent = ref();
const mediaContent = ref();
const isMediaContent = computed(() => Boolean(mediaContent.value));
const isVisible = ref(false);
const isGetFileContentLoading = ref(false);
const isSaveLoading = ref(false);
const fileData = ref<File | null>(null);
const handleSave = async () => {
  try {
    isSaveLoading.value = true;
    const file = stringToFile(fileContent.value);
    await API.editFile({
      file,
      project_id: Number(route.params.id),
      path_file: fileData!.value!.path,
    });
    toast.add({
      color: 'green',
      title: 'Save file successfully',
    });
  } catch (error: any) {
    toast.add({
      color: 'red',
      title: error.message,
    });
  } finally {
    isSaveLoading.value = false;
  }
};

const show = async (file: File) => {
  try {
    error.value = null;
    fileData.value = null;
    fileContent.value = '';
    mediaContent.value = '';

    isVisible.value = true;
    isGetFileContentLoading.value = true;
    if (isValidImageExt(file?.extras_field?.name)) {
      const res: any = await API.getPublicAsset({
        project_id: file.project_id,
        path: file.path,
      });
      mediaContent.value = URL.createObjectURL(res);
    } else {
      fileContent.value = await API.readFile({
        project_id: file.project_id,
        path_file: file.path,
      });
    }
    fileData.value = file;

    // await nextTick();
    // const monaco = useMonaco()!;
    // const model = monaco.editor.createModel(data, undefined, monaco.Uri.file(file.extras_field.name));
    // console.log(model);
    // monaco.editor.getEditors()[0].setModel(model);
    // console.log(monaco.editor.getEditors()[0]);

    // const monaco = useMonaco()!;
    // const model = monaco.editor.getEditors()[0].getModel()!;
    // monaco.editor.setModelLanguage(model, 'typescript');
  } catch (err: any) {
    error.value = err.message;
  } finally {
    isGetFileContentLoading.value = false;
  }
};

const hide = () => {
  isVisible.value = false;
};

defineExpose({
  show,
  hide,
});
</script>

<style scoped></style>
