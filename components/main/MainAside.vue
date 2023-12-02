<template>
  <aside
    class="shrink-0 bg-primary dark:bg-gray-900 text-white flex items-center lg:items-stretch lg:flex-col justify-between transition-all py-2 px-6"
    :class="{
      'lg:w-[260px] lg:p-6': isAsideVisible,
      'lg:w-[80px] lg:py-6 lg:px-4': !isAsideVisible,
    }"
  >
    <div class="space-y-4">
      <NuxtLink v-if="isAsideVisible" to="/" class="text-2xl font-bold block text-center">NEWGEN</NuxtLink>
      <UButton v-else to="/" icon="i-mdi-arrow-left" block variant="link" color="white" size="lg" />
      <UVerticalNavigation
        class="hidden lg:block"
        :links="topLinks"
        :ui="{
          padding: 'py-3',
          inactive: 'text-inherit',
          icon: {
            base: 'w-6 h-6',
            inactive: 'text-inherit',
          },
          base: isAsideVisible ? undefined : 'justify-center',
          label: isAsideVisible ? undefined : 'hidden',
        }"
      />
    </div>
    <UButton
      type="button"
      variant="link"
      color="white"
      :icon="toggleColorModeButtonAttrs.icon"
      class="lg:mt-auto ml-auto lg:ml-0"
      :ui="{
        base: 'hover:!no-underline',
        icon: {
          base: 'w-6 h-6',
        },
      }"
      @click="handleToggleColorMode"
    >
      <span v-if="isAsideVisible" class="hidden lg:block line-clamp-1 truncate">
        {{ toggleColorModeButtonAttrs.label }}
      </span>
    </UButton>
    <UDropdown :items="bottomLinks" mode="hover">
      <UButton
        type="button"
        color="white"
        variant="link"
        icon="i-mdi-account-circle"
        block
        :ui="{
          base: 'hover:!no-underline',
          icon: {
            base: 'w-6 h-6',
          },
        }"
      >
        <span v-if="isAsideVisible" class="hidden lg:block line-clamp-1 truncate">{{ authData?.user?.email }}</span>
      </UButton>
    </UDropdown>
    <UButton
      icon="i-mdi-menu"
      variant="link"
      size="xl"
      color="white"
      class="ml-2 lg:hidden"
      @click="handleToggleMenu"
    />
    <USlideover v-model="isMenuVisible">
      <UCard
        class="flex flex-col flex-1"
        :ui="{
          body: { base: 'flex-1 overflow-y-auto' },
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-2xl font-semibold">Menu</h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              size="xl"
              @click="handleHideMenu"
            />
          </div>
        </template>
        <template #default>
          <UVerticalNavigation
            :links="topLinks"
            :ui="{
              active: 'text-black',
              padding: 'py-3',
              icon: {
                base: 'w-6 h-6',
              },
            }"
          />
        </template>
      </UCard>
    </USlideover>
  </aside>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
const toggleColorModeButtonAttrs = computed(() => {
  return colorMode.preference === 'dark'
    ? {
        icon: 'i-mdi-white-balance-sunny',
        label: 'Light mode',
      }
    : {
        icon: 'i-mdi-moon-waning-crescent',
        label: 'Dark mode',
      };
});

const handleToggleColorMode = () => {
  colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark';
};

const { data: authData, signOut } = useAuth();
const toast = useToast();
const route = useRoute();
const generalStore = useGeneralStore();
const isAsideVisible = computed(() => !route.meta.mainAsideCompact);

const topLinks = computed(() => {
  let links;
  if ((route?.name || '').toString().startsWith('organization-organizationId-')) {
    links = [
      {
        label: 'Projects',
        icon: 'i-mdi-apps',
        to: {
          name: 'organization-organizationId-projects',
          params: {
            organizationId: route.params.organizationId,
          },
        },
      },
      {
        label: 'Domain',
        icon: 'i-mdi-web',
        to: {
          name: 'organization-organizationId-domain',
          params: {
            organizationId: route.params.organizationId,
          },
        },
      },
      {
        label: 'Org settings',
        icon: 'i-mdi-cog',
        to: {
          name: 'organization-organizationId-settings',
          params: {
            organizationId: route.params.organizationId,
          },
        },
      },
    ];
  } else {
    links = [
      {
        label: 'Organizations',
        icon: 'i-mdi-domain',
        to: {
          name: 'organizations',
        },
      },
      {
        label: 'Account settings',
        icon: 'i-mdi-user',
        to: {
          name: 'account',
        },
      },
    ];
  }
  return links.map((item) => ({
    ...item,
    active: (route?.name || '').toString().startsWith(item.to.name),
    activeClass: 'text-red-500',
  }));
});

const handleLogout = async () => {
  try {
    generalStore.showFullPageLoading();
    await signOut();
    await API.logout();
    navigateTo('/');
  } catch (error: any) {
    toast.add({
      title: error.message,
      color: 'red',
    });
  } finally {
    generalStore.hideFullPageLoading();
  }
};

const bottomLinks = [
  [
    {
      label: 'Settings',
      icon: 'i-heroicons-cog-8-tooth',
      to: {
        name: 'account-details',
      },
    },
    {
      label: 'Sign out',
      icon: 'i-heroicons-arrow-left-on-rectangle',
      click: handleLogout,
    },
  ],
];

const isMenuVisible = ref(false);
const handleHideMenu = () => {
  isMenuVisible.value = false;
};
const handleToggleMenu = () => {
  isMenuVisible.value = !isMenuVisible.value;
};
</script>

<style scoped></style>
