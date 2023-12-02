<template>
  <div class="lg:flex lg:min-h-screen">
    <SubAside class="lg:w-[300px] shrink-0" title="Account Settings" :links="links" />
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
      if (to.name === 'account') {
        return navigateTo({
          name: 'account-details',
        });
      }
    },
  ],
});

const links = computed(() => [
  {
    label: 'Details',
    icon: 'i-mdi-cog',
    to: {
      name: 'account-details',
    },
  },
  {
    label: 'Password',
    icon: 'i-mdi-cog',
    to: {
      name: 'account-password',
    },
  },
  {
    label: 'Delete',
    icon: 'i-mdi-cog',
    to: {
      name: 'account-delete',
    },
  },
]);
</script>

<style scoped></style>