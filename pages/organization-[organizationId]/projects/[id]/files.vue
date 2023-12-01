<template>
  <section>
    <h2 class="main-title">Files</h2>
    <Browser
      v-model:sort="sortSelected"
      v-model:search="search"
      :sort-options="sortOptions"
      :button-dropdown-items="createDropdownItems"
    />
    <Breadcrumb v-model="dir" />
    <BaseEmpty v-if="!isGetFilesLoading && !Object.keys(groupedFiles).length" />
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6 group"
      :class="{
        'is-dragging': currentItemDragging,
      }"
      @dragend="handleDragEnd"
      @dragover.prevent
    >
      <template v-if="isGetFilesLoading">
        <BlockItemSkeleton v-for="item in 10" :key="item" />
      </template>
      <template v-else-if="Object.keys(groupedFiles).length">
        <template v-for="(_files, folder) in groupedFiles" :key="folder">
          <template v-if="folder === ''">
            <template v-for="(file, index) in _files" :key="file.id">
              <BlockItem
                draggable="true"
                class="group-[.is-dragging]:opacity-50"
                :class="{
                  'col-start-1': index === 0,
                }"
                :title="file.extras_field?.name"
                :dropdown-items="fileDropdownItems(file)"
                @dragstart="handleDragStart(file)"
                @click="handlePreviewFile(file)"
              >
                <template #icon>
                  <img :src="`${getMaterialFileIcon(file.path)}`" alt="" />
                </template>
              </BlockItem>
            </template>
          </template>
          <BlockItem
            v-else
            draggable="true"
            class="order-first"
            :icon="_files.length > 0 ? 'i-mdi-folder' : 'i-mdi-folder-outline'"
            :title="folder"
            :description="_files.length > 1 ? `${_files.length} items` : `${_files.length} item`"
            :dropdown-items="folderDropdownItems(folder)"
            @dragstart="handleDragStart(folder)"
            @drop="handleDrop(folder)"
            @click="handleOpenFolder(folder)"
          />
        </template>
      </template>
    </div>

    <SlideEditFile ref="slideEditFileRef" />
    <ModalInputName ref="modalInputNameRef" />
    <input ref="inputUploadFilesRef" type="file" multiple hidden @change="handleUploadFile" />
    <input ref="inputUploadFolderRef" type="file" webkitdirectory hidden @change="handleUploadFolder" />
  </section>
</template>

<script setup lang="ts">
import { getMaterialFileIcon } from 'file-extension-icon-js';
import type { MqttClient } from 'mqtt';
import type { Files, File } from '@/types/file';

const route = useRoute();

const generalStore = useGeneralStore();
const { showFullPageLoading, hideFullPageLoading } = generalStore;

const toast = useToast();

const modalInputNameRef = ref();

const search = ref('');
const sortOptions = [
  {
    label: 'Path',
    value: 'path',
  },
  {
    label: 'Path (Z-A)',
    value: '-path',
  },
];
const sortSelected = ref(sortOptions[0]);

const handleCreateFile = async () => {
  try {
    const path = await modalInputNameRef.value.show({
      modalTitle: 'Add file',
      validateSchema: validateSchemaFile,
    });
    showFullPageLoading();
    await API.createFile({
      file: stringToFile(''),
      path_file: dirPathString.value + path,
      project_id: Number(route.params.id),
    });
    // toast.add({
    //   title: 'Create file successfully',
    //   color: 'green',
    // });
    // handleGetFiles();
  } catch (error: any) {
    toast.add({
      title: error.message,
      color: 'red',
    });
  } finally {
    // hideFullPageLoading();
  }
};
const handleCreateFolder = async () => {
  const folderName = await modalInputNameRef.value.show({
    modalTitle: 'Add folder',
    validateSchema: validateSchemaFolder,
  });
  files.value.push({
    path: dirPathString.value + folderName + '/',
  } as any);
};
const inputUploadFilesRef = ref();
const handleUploadFile = async (e: any) => {
  try {
    showFullPageLoading();
    await API.uploadFiles({
      file: Array.from(e.target.files),
      dir: dirPathString.value,
      project_id: Number(route.params.id),
    });
    toast.add({
      title: 'Upload files successfully',
      color: 'green',
    });
    // handleGetFiles();
  } catch (error: any) {
    toast.add({
      title: error.message,
      color: 'red',
    });
  } finally {
    // hideFullPageLoading();
  }
};
const inputUploadFolderRef = ref();
const handleUploadFolder = async (e: any) => {
  try {
    showFullPageLoading();
    await API.uploadFolder({
      path_file: Array.from(e.target.files).map((file: any) => file.webkitRelativePath),
      file: Array.from(e.target.files),
      dir: dirPathString.value,
      project_id: Number(route.params.id),
    });
    toast.add({
      title: 'Upload folder successfully',
      color: 'green',
    });
    // handleGetFiles();
  } catch (error: any) {
    toast.add({
      title: error.message,
      color: 'red',
    });
  } finally {
    // hideFullPageLoading();
  }
};
const createDropdownItems = [
  [
    {
      label: 'Create file',
      icon: 'i-mdi-file-plus',
      click: handleCreateFile,
    },
    {
      label: 'Create folder',
      icon: 'i-mdi-folder-plus-outline',
      click: handleCreateFolder,
    },
  ],
  [
    {
      label: 'Upload files',
      icon: 'i-mdi-file-upload',
      click: () => inputUploadFilesRef.value.click(),
    },
    {
      label: 'Upload folder',
      icon: 'i-mdi-folder-upload',
      click: () => inputUploadFolderRef.value.click(),
    },
  ],
];

const isGetFilesLoading = ref(false);
const files = ref<Files>([]);
const handleGetFiles = async (loading = true) => {
  try {
    loading && (isGetFilesLoading.value = true);
    const res: any = await API.getFiles({
      id: 10,
      project_id: Number(route.params.id),
    });
    files.value = res.data.data;
  } catch (error: any) {
    toast.add({
      title: error.message,
      color: 'red',
    });
  } finally {
    loading && (isGetFilesLoading.value = false);
  }
};
handleGetFiles();

const filesFiltered = computed(() => {
  if (!search.value) return files.value || [];
  return (files.value || []).filter((file: any) => {
    return file.path.split('/')[0].includes(search.value);
  });
});
const dir = ref<string[]>([]);
const dirPathString = computed(() => (dir.value?.length ? dir.value.join('/') + '/' : ''));
const groupedFiles = computed(() => {
  const result = filesFiltered.value
    .filter((file: any) => file?.path?.startsWith(dirPathString.value))
    .reduce((acc: any, file: any) => {
      const pathPartsWithoutSubFolderPath = file.path.replace(dirPathString.value, '');
      if (pathPartsWithoutSubFolderPath === '') return acc;
      const [folderPath, ...restPathParts] = pathPartsWithoutSubFolderPath.split('/');
      const folder = restPathParts.length ? folderPath : '';
      if (!acc[folder]) {
        acc[folder] = [];
      }
      if (restPathParts.at(-1) !== '') {
        acc[folder].push(file);
      }
      return acc;
    }, {});
  // SORT
  const isReverse = sortSelected.value.value.includes('-');
  const sortValue = isReverse ? -1 : 1;
  if (result['']) {
    result[''].sort((a: File, b: File) => sortValue * a.path.localeCompare(b.path));
  }
  return Object.fromEntries(
    Object.entries(result).sort(([keyA], [keyB]) => sortValue * keyA.localeCompare(keyB)),
  ) as Record<string, Files>;
});

const handleRenameFile = async (file: File) => {
  try {
    const newFileName = await modalInputNameRef.value.show({
      modalTitle: 'Rename file',
      name: file.extras_field.name,
      validateSchema: validateSchemaFile,
    });
    await API.renameFile({
      project_id: Number(route.params.id),
      path_file: file.path,
      to_path_file: file.path.replace(file.extras_field.name, newFileName),
    });
    // handleGetFiles();
  } catch (error: any) {
    toast.add({
      title: error.message,
      color: 'red',
    });
  }
};
const handleRenameFolder = async (folderName: string) => {
  try {
    const newFolderName = await modalInputNameRef.value.show({
      modalTitle: 'Rename folder',
      name: folderName,
      validateSchema: validateSchemaFolder,
    });
    await API.cutPath({
      path: dirPathString.value + folderName,
      to_path: dirPathString.value + newFolderName,
      project_id: Number(route.params.id),
    });
    // handleGetFiles();
  } catch (error: any) {
    toast.add({
      title: error.message,
      color: 'red',
    });
  }
};
const handleMoveToNewFolder = async (item: File | string, newFolderName?: string) => {
  try {
    if (!newFolderName) {
      newFolderName = await modalInputNameRef.value.show({
        modalTitle: 'Move to new folder',
        validateSchema: validateSchemaFolder,
      });
    }
    const isFileObject = trueTypeOf(item) === 'object';
    const isFolderItself = !isFileObject && item === newFolderName;
    if (isFolderItself) return;
    showFullPageLoading();
    const fromPath = isFileObject ? (item as File)?.path : dirPathString.value + item;
    const toPath = dirPathString.value + newFolderName + '/' + fromPath.split('/').at(-1);
    await API.cutPath({
      path: fromPath,
      to_path: toPath,
      project_id: Number(route.params.id),
    });
    // handleGetFiles();
  } catch (error: any) {
    toast.add({
      title: error.message,
      color: 'red',
    });
  } finally {
    // hideFullPageLoading();
  }
};

const slideEditFileRef = ref();
const handlePreviewFile = (file: File) => {
  slideEditFileRef.value.show(file);
};
const handleCloneFile = async (path: string) => {
  try {
    showFullPageLoading();
    await API.clonePath({
      path_file: path,
      project_id: Number(route.params.id),
    });
    // handleGetFiles();
  } catch (error: any) {
    toast.add({
      title: error.message,
      color: 'red',
    });
  } finally {
    // hideFullPageLoading();
  }
};

const handleDeletePath = async (path: string) => {
  try {
    showFullPageLoading();
    await API.deletePath({
      path,
      project_id: Number(route.params.id),
    });
    // uuid: 699846649
    // handleGetFiles();
  } catch (error: any) {
    toast.add({
      title: error.message,
      color: 'red',
    });
  } finally {
    // hideFullPageLoading();
  }
};
const handleOpenFolder = (folderName: string) => {
  dir.value.push(folderName);
};
const folderDropdownItems = (folderName: string) => {
  return [
    [
      {
        label: 'Open folder',
        icon: 'i-mdi-folder-open',
        click: () => handleOpenFolder(folderName),
      },
    ],
    [
      {
        label: 'Move to folder',
        icon: 'i-mdi-folder-arrow-left-right',
        click: () => handleMoveToNewFolder(folderName),
      },
      {
        label: 'Rename folder',
        icon: 'i-mdi-rename',
        click: () => handleRenameFolder(folderName),
      },
    ],
    [
      {
        label: 'Delete folder',
        icon: 'i-mdi-delete',
        click: () => handleDeletePath(dirPathString.value + folderName),
      },
    ],
  ];
};
const fileDropdownItems = (file: File) => {
  return [
    [
      {
        label: 'Open file',
        icon: 'i-mdi-eye-arrow-left',
        click: () => handlePreviewFile(file),
      },
    ],
    [
      {
        label: 'Move to folder',
        icon: 'i-mdi-file-arrow-left-right',
        click: () => handleMoveToNewFolder(file),
      },
      {
        label: 'Clone file',
        icon: 'i-mdi-content-copy',
        click: () => handleCloneFile(file.path),
      },
      {
        label: 'Rename file',
        icon: 'i-mdi-rename',
        click: () => handleRenameFile(file),
      },
    ],
    [
      {
        label: 'Delete file',
        icon: 'i-mdi-delete',
        click: () => handleDeletePath(file.path),
      },
    ],
  ];
};

const currentItemDragging = ref<File | string | null>(null);
const handleDragStart = (item: File | string) => {
  currentItemDragging.value = item;
};
const handleDragEnd = () => {
  currentItemDragging.value = null;
};
const handleDrop = async (folder: string) => {
  if (!currentItemDragging.value) return;
  await handleMoveToNewFolder(currentItemDragging.value, folder);
};

const mqttClient = inject('mqttClient') as MqttClient;
const mqttListener = (_: string, payload: Buffer) => {
  const eventType = tryParseJson(payload.toString())?.event_type;
  if (eventType === EVENT_TYPE.PUSH_COMPLETE) {
    handleGetFiles();
    hideFullPageLoading();
  }
};

onMounted(() => {
  mqttClient.on('message', mqttListener);
});

onBeforeUnmount(() => {
  mqttClient.removeListener('message', mqttListener);
});
</script>

<style scoped></style>
