<template>
  <div class="lg:flex lg:min-h-screen">
    <SubAside class="lg:w-[300px] shrink-0" title="Org Settings" :links="links" />
    <section class="p-6 grow">
      <NuxtPage />
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  mainAsideCompact: true,
  nonLayoutPadding: true,
  middleware: [
    (to) => {
      if (to.name === 'organization-organizationId-settings') {
        return navigateTo({
          name: 'organization-organizationId-settings-delete',
          params: {
            organizationId: to.params.organizationId,
          },
        });
      }
    },
  ],
});
const links = computed(() => [
  {
    label: 'Delete',
    icon: 'i-mdi-cog',
    to: {
      name: 'organization-organizationId-settings-delete',
    },
  },
]);
</script>

<style scoped></style>
