<template>
  <UModal
    v-model="isOpen"
    :ui="{
      width: 'sm:max-w-6xl',
    }"
  >
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold">Diff</h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="isOpen = false"
          />
        </div>
      </template>
      <BaseLoading v-if="isGetDiffLoading" />
      <div v-else v-html="diffHtml"></div>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import * as Diff2Html from 'diff2html';
import 'diff2html/bundles/css/diff2html.min.css';
import {ColorSchemeType} from "diff2html/lib/types";
const colorMode = useColorMode();

const diffHtml = ref('');
const toast = useToast();
const isOpen = ref(false);
const isGetDiffLoading = ref(false);
const handleShowDiffModal = async (activityId: number) => {
  try {
    isGetDiffLoading.value = true;
    const res: any = await API.getActivityDiff({
      id: activityId,
    });
    diffHtml.value = Diff2Html.html(res, {
      drawFileList: true,
      matching: 'lines',
      outputFormat: 'side-by-side',
      colorScheme: colorMode.preference === 'dark' ? ColorSchemeType.DARK : ColorSchemeType.LIGHT,
    });
  } catch (error: any) {
    toast.add({
      title: error.title,
      color: 'red',
    });
  } finally {
    isGetDiffLoading.value = false;
  }
};
const show = (activityId: number) => {
  isOpen.value = true;
  handleShowDiffModal(activityId);
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
