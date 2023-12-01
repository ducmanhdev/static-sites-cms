<template>
  <UCard
    class="cursor-pointer"
    :ui="{
      body: {
        padding: 'p-4 sm:p-4',
      },
      footer: {
        padding: 'p-4 py-2 sm:p-4 sm:py-2',
      },
    }"
  >
    <div class="flex gap-4">
      <UAvatar size="md" src="https://avatars.githubusercontent.com/u/739984?v=4" alt="Avatar" class="shrink-0" />
      <div class="grow">
        <p class="font-semibold">Beatriz</p>
        <p class="text-gray-500 flex items-center gap-2">
          <UIcon name="i-mdi-pencil" />
          Made {{ data.length }} {{ data.length > 1 ? 'changes' : 'change' }}
        </p>
        <p class="text-gray-500 flex items-center gap-2">
          <UIcon name="i-mdi-clock-outline" />
          {{ dayjs(createdAt).fromNow() }}
        </p>
      </div>
    </div>
    <template v-if="data.length > 1" #footer>
      <ul v-if="isChangesVisible" class="pl-5 mb-2 list-disc">
        <li>Added content/policy.md</li>
        <li>Updated data/nav.json</li>
      </ul>
      <UButton variant="ghost" color="gray" block @click="toggleChangesVisible">View Changes</UButton>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import RelativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(RelativeTime);

interface Props {
  createdAt: string;
  data: {
    action: string;
    path: string;
  }[];
  user: any;
}

defineProps<Props>();

const isChangesVisible = ref(false);
const toggleChangesVisible = () => {
  isChangesVisible.value = !isChangesVisible.value;
};
</script>

<style scoped></style>
