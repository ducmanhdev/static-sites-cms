<template>
  <div class="bg-white dark:bg-gray-800 text-black dark:text-white absolute inset-0 p-6 shadow overflow-y-auto space-y-4 z-10">
    <UButton v-if="closeable" icon="i-mdi-arrow-left" label="back" @click="$emit('remove')" />
    <h2 v-if="title" class="text-2xl font-semibold">{{ title }}</h2>
    <template v-for="(value, key) in modelValue" :key="key">
      <template v-if="!['_block_name', '_inputs'].includes(key)">
        <!-- FOR CONTENT BLOCKS -->
        <UFormGroup v-if="key === 'content_blocks'" label="Content blocks">
          <VueDraggableNext class="space-y-2" :list="value" handle=".button-drag">
            <TransitionGroup name="list">
              <BlockItem
                v-for="block in value"
                :key="block._block_name"
                :title="getBlockInformation(block._block_name)?.json?.spec?.label"
                :description="getBlockInformation(block._block_name)?.json?.spec?.description"
                show-button-drag
                @click="handleAddLayer({ data: block })"
              />
            </TransitionGroup>
          </VueDraggableNext>
          <UDropdown
            :items="blockContentItems"
            class="w-full mt-2"
            :ui="{
              width: 'w-96',
              item: {
                base: 'justify-between',
              },
            }"
          >
            <UButton label="Add block" block variant="outline" icon="i-mdi-plus" />
            <template #item="{ item }">
              <span class="truncate font-medium">{{ item.label }}</span>
              <span class="truncate text-gray-400 text-sm">{{ item.description }}</span>
            </template>
          </UDropdown>
        </UFormGroup>

        <!-- FOR ARRAY -->
        <UFormGroup v-else-if="trueTypeOf(value) === 'array'" :label="slugToTitle(key)">
          <VueDraggableNext class="space-y-2" :list="value" handle=".button-drag">
            <TransitionGroup name="list">
              <BlockItem
                v-for="block in value"
                :key="block"
                :title="`${key} item`"
                show-button-drag
                @click="handleAddLayer({ data: block, key: `${key}[*]` })"
              />
            </TransitionGroup>
          </VueDraggableNext>
          <UButton
            label="Add block"
            block
            variant="outline"
            icon="i-mdi-plus"
            class="mt-2"
            @click="handleAddArrItem(key)"
          />
        </UFormGroup>

        <!-- FOR OBJECT -->
        <UFormGroup v-else-if="trueTypeOf(value) === 'object'" :label="slugToTitle(key)">
          <BlockItem :title="`${key} block`" @click="handleAddLayer({ key })" />
        </UFormGroup>

        <!-- FOR OTHER INPUT -->
        <UFormGroup
          v-else
          :label="handleGetFieldConfig(key).label"
          :description="handleGetFieldConfig(key).description"
        >
          <QuillEditor
            v-if="handleGetFieldConfig(key)?.type === 'markdown'"
            v-model:content="data[key]"
            content-type="html"
            style="font-size: inherit"
          />
          <UCheckbox v-else-if="handleGetFieldConfig(key)?.type === 'checkbox'" v-model="data[key]" />
          <URadioGroup
            v-else-if="handleGetFieldConfig(key)?.type === 'radio'"
            v-model="data[key]"
            :options="handleGetFieldConfig(key)?.options"
          />
          <USelect
            v-else-if="handleGetFieldConfig(key)?.type === 'select'"
            v-model="data[key]"
            :options="handleGetFieldConfig(key)?.options"
            option-attribute="name"
          />
          <DatePicker v-else-if="handleGetFieldConfig(key)?.type === 'date'" v-model="data[key]" />
          <InputColor v-else-if="handleGetFieldConfig(key)?.type === 'color'" v-model="data[key]" />
          <ImageUpload v-else-if="handleGetFieldConfig(key)?.type === 'image'" v-model="data[key]" />
          <UInput v-else v-model="data[key]" />
        </UFormGroup>
      </template>
    </template>
  </div>
  <SlideEditPageLayerChild
    v-if="pageLayerChild.data"
    v-model="pageLayerChild.data"
    :config="pageLayerChild.config"
    :title="pageLayerChild.title"
    closeable
    @remove="handleRemoveLayer"
  />
</template>

<script setup lang="ts">
import { QuillEditor } from '@vueup/vue-quill';
import type { IPageData } from '@/types';
import SlideEditPageLayerChild from '~/components/SlideEditPageLayer.vue';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const projectStore = useProjectStore();
const projectConfig = computed(() => projectStore.config);
const projectComponentConfig = computed(() => projectStore.componentConfig);

interface Props {
  title?: string;
  modelValue: IPageData;
  config?: Record<string, any>;
  closeable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  closeable: false,
});

interface Emits {
  (e: 'update:modelValue', newValue: any): void;

  (e: 'remove'): void;
}

const emits = defineEmits<Emits>();

const data = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emits('update:modelValue', newValue);
  },
});

const handleAddContentBlock = (block: { [key: string]: any }) => {
  data.value.content_blocks.push({
    _block_name: block.sub_path.replace('.yml', ''),
    ...block.json.blueprint,
  });
};

const blockContentItems = computed(() => {
  return projectComponentConfig.value.map((item) => [
    {
      label: item?.json?.spec?.label,
      description: item?.json?.spec?.description,
      click: () => handleAddContentBlock(item),
    },
  ]);
});

const handleAddArrItem = (key: string) => {
  const defaultData = props.config?.blueprint?.[key][0];
  data.value[key].push(defaultData);
};

interface IPageLayerChild {
  title: string;
  data: any;
  config: any;
}

const pageLayerChild = ref<IPageLayerChild>({
  title: '',
  data: null,
  config: null,
});

const handleAddLayer = ({ key, data }: { key?: string; data?: any }) => {
  const _getLayerChildConfig = (_key: string) => {
    const config = props.modelValue?._inputs || props.config?._inputs || props.config || projectConfig.value?._inputs;
    const configTransformed = Object.entries(config).reduce((result, [key, value]) => {
      if (key.split('.').length > 1) {
        const [key1, key2] = key.split('.');
        if (!result[key1]) {
          result[key1] = {};
        }
        result[key1][key2] = value;
      } else {
        result[key] = value;
      }
      return result;
    }, {} as any);
    return configTransformed?.[_key];
  };
  pageLayerChild.value.data = data;
  pageLayerChild.value.config = null;
  pageLayerChild.value.title = '';
  if (data) {
    if (data._block_name) {
      pageLayerChild.value.config = getBlockInformation(data._block_name)?.json;
      pageLayerChild.value.title = getBlockInformation(data._block_name)?.json?.spec?.label;
    } else if (key) {
      pageLayerChild.value.config = _getLayerChildConfig(key);
      pageLayerChild.value.title = slugToTitle(key);
    }
  } else if (key) {
    pageLayerChild.value.data = props.modelValue[key];
    pageLayerChild.value.config = _getLayerChildConfig(key);
    pageLayerChild.value.title = slugToTitle(key);
  }
};
const handleRemoveLayer = () => {
  pageLayerChild.value = {
    title: '',
    data: null,
    config: null,
  };
};
const getBlockInformation = (blockName: string) => {
  return projectComponentConfig.value.find((config) => config.sub_path.replace('.yml', '') === blockName);
};
const handleGenerateDefaultType = (key: string) => {
  if (!key) return '';
  switch (true) {
    case key.includes('color'):
      return 'color';
    default:
      return '';
  }
};
const handleGetFieldConfig = (key: string) => {
  const blockConfig = props.modelValue?._inputs || props?.config?._inputs || props?.config || {};
  const globalConfig = projectConfig.value?._inputs || {};
  const defaultType = handleGenerateDefaultType(key);
  const config = blockConfig[key] ||
    globalConfig[key] || {
      label: '',
      description: '',
      type: '',
    };
  return {
    ...config,
    label: config.label || slugToTitle(key),
    type: config?.type || defaultType,
  };
};
</script>

<style scoped></style>