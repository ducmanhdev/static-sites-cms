<template>
  <div>
    <h1 class="main-title mb-4">Delete your organization</h1>
    <h2 class="sub-title font-medium mb-6">
      Do you want to delete <strong>{{ organizationName }}</strong> organization
    </h2>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="handleSubmit">
      <UFormGroup label="Organization name" name="name" required>
        <UInput v-model="state.name" type="name" placeholder="Please enter organization name" />
      </UFormGroup>
      <UButton
        type="submit"
        color="red"
        icon="i-mdi-trash-can-outline"
        :disabled="state.name !== organizationName"
        :loading="isSubmitLoading"
      >
        Delete Organization
      </UButton>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod';

const route = useRoute();
const toast = useToast();
const organizationStore = useOrganizationStore();
const organizationName = computed(() => organizationStore.organizationInfo?.name);

const schema = computed(() =>
  z.object({
    name: z.string().refine((value) => value === organizationName.value, {
      message: 'Is incorrect',
    }),
  }),
);
const state = reactive({
  name: '',
});
const isSubmitLoading = ref(false);
const handleSubmit = async () => {
  try {
    isSubmitLoading.value = true;
    await API.deleteOrganization({
      id: Number(route.params.organizationId),
    });
    toast.add({
      title: 'Organization deleted',
      color: 'green',
    });
    navigateTo('/');
  } catch (error: any) {
    toast.add({
      title: error.message,
      color: 'red',
    });
  } finally {
    isSubmitLoading.value = false;
  }
};
</script>

<style scoped></style>
