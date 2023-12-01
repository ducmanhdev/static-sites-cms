<template>
  <UPopover :popper="{ placement: 'bottom-start' }">
    <UInput icon="i-heroicons-calendar-days-20-solid" :value="label" readonly class="w-full" />
    <template #panel="{ close }">
      <DateCalender v-model="date" @close="close" />
    </template>
  </UPopover>
</template>
<script setup lang="ts">
import dayjs from 'dayjs';

const date = ref(new Date());
const label = computed(() => dayjs(date.value).format(DATE_TIME_FORMAT));
</script>
