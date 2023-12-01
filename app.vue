<template>
  <div class="bg-white text-black dark:bg-gray-950 dark:text-white">
    <NuxtLayout />
    <Teleport to="body">
      <div
        v-if="generalStore.isFullPageLoading"
        class="fixed inset-0 z-[9999999] bg-white/60 dark:bg-gray-950/60 flex justify-center items-center"
      >
        <BaseLoading />
      </div>
    </Teleport>
    <Teleport to="body">
      <UNotifications />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const generalStore = useGeneralStore();
</script>

<style></style>