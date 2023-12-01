<template>
  <div class="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-4 mb-6">
    <USelectMenu v-model="_sort" :options="sortOptions" class="shrink-0 w-full sm:w-[260px]">
      <template #leading>
        <UIcon name="i-mdi-sort" />
      </template>
    </USelectMenu>
    <UInput
      v-model="_search"
      placeholder="Search..."
      icon="i-heroicons-magnifying-glass-20-solid"
      :ui="{ icon: { trailing: { pointer: '' } } }"
      class="grow "
    >
      <template #trailing>
        <UButton
          v-show="search !== ''"
          color="gray"
          variant="link"
          icon="i-heroicons-x-mark-20-solid"
          :padded="false"
          @click="handleClearSearch"
        />
      </template>
    </UInput>
    <component
      :is="buttonDropdownItems ? 'UDropdown' : 'div'"
      v-bind="buttonDropdownItems && { items: buttonDropdownItems }"
      v-if="buttonVisible"
    >
      <UButton
        icon="i-ion-add-circle-outline"
        :label="buttonLabel"
        block
        class="min-w-[160px]"
        :loading='buttonLoading'
        @click="handleButtonClick"
      />
    </component>
  </div>
</template>

<script setup lang="ts">
import type { DropdownItem } from '#ui/types';

type SortOptions = string[] | { [key: string]: any; disabled?: boolean }[];

interface Props {
  sort: SortOptions[number];
  sortOptions: SortOptions;
  search: string;
  buttonLabel?: string;
  buttonDropdownItems?: DropdownItem[][];
  buttonVisible?: boolean;
  buttonLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  buttonLabel: 'Add',
  buttonVisible: true,
  buttonLoading: false,
});

interface Emits {
  (event: 'update:sort', value: SortOptions[number]): void;

  (event: 'update:search', value: string): void;

  (event: 'button-click'): void;
}

const emit = defineEmits<Emits>();

const _sort = computed({
  get() {
    return props.sort;
  },
  set(newValue) {
    emit('update:sort', newValue);
  },
});
const _search = computed({
  get() {
    return props.search;
  },
  set(newValue) {
    emit('update:search', newValue);
  },
});
const handleClearSearch = () => {
  _search.value = '';
};
const handleButtonClick = () => {
  emit('button-click');
};
</script>

<style scoped></style>
