<template>
  <UCard>
    <div class="flex items-center gap-4">
      <USkeleton class="h-8 w-8" :ui="{ rounded: 'rounded-full' }" />
      <div class="grow space-y-2">
        <USkeleton class="h-4" />
        <USkeleton class="h-4" />
      </div>
    </div>
  </UCard>
</template>