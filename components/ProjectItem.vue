<template>
  <UCard
    :ui="{
      body: {
        padding: 0,
      },
    }"
  >
    <NuxtLink :to="to" class="block aspect-w-3 aspect-h-2 overflow-hidden">
      <NuxtImg :src="thumbnailSrc" class="min-h-full h-auto" :alt="imageAlt || title" placeholder/>
    </NuxtLink>
    <div class="px-4 py-5">
      <h4 class="text-lg font-bold mb-1">
        <NuxtLink :to="to">
          {{ title }}
        </NuxtLink>
      </h4>
      <ul class="[&>*]:flex [&>*]:items-center [&>*]:gap-2">
        <li>
          <UIcon name="i-mdi-link-variant" />
          {{ link }}
        </li>
        <li>
          <UIcon name="i-mdi-wrench" />
          Build {{ dayjs(buildTime).fromNow() }}
        </li>
        <li>
          <UIcon name="i-mdi-cloud-sync" />
          Synced {{ dayjs(syncedTime).fromNow() }}
        </li>
      </ul>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface Props {
  id: number;
  code: string;
  imageAlt: any;
  link: any;
  title: any;
  buildTime: any;
  syncedTime: any;
  logIdLast: any;
}

const props = defineProps<Props>();

const to = computed(() => ({
  name: 'organization-organizationId-projects-id',
  params: {
    id: props.id,
  },
}));
const thumbnailSrc = computed(() => API.getProjectThumbnail({
  code: props.code,
  logIdLast: props.logIdLast
}));
</script>

<style scoped></style>
