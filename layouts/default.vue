<template>
  <div class="lg:flex lg:h-screen">
    <MainAside />
    <main
      class="flex-grow h-full overflow-y-auto"
      :class="{
        'p-6': !$route.meta.nonLayoutPadding,
      }"
    >
      <NuxtLoadingIndicator />
      <NuxtPage />
    </main>
  </div>
</template>