<template>
  <div class="min-h-screen flex items-center">
    <div class="container">
      <div class="max-w-md mx-auto">
        <h1 class="main-title text-center">Login</h1>
        <UForm :schema="schema" :state="state" class="space-y-4" @submit="handleSubmit">
          <UFormGroup label="Email / Username" name="attribute" required>
            <UInput v-model="state.attribute" />
          </UFormGroup>
          <UFormGroup label="Password" name="password" required>
            <UInput v-model="state.password" type="password" />
          </UFormGroup>
          <p class="text-center">
            Don't have an account?
            <NuxtLink to="/register" class="underline">Register</NuxtLink>
          </p>
          <UButton type="submit" :loading="isSubmitLoading" block>Submit</UButton>
        </UForm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';

definePageMeta({
  layout: 'empty',
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/',
  },
});

const { signIn } = useAuth();
const toast = useToast();

const schema = z.object({
  attribute: z.string().min(1, 'Email / Username is required'),
  password: z.string().min(8, 'Must be at least 8 characters'),
});

type Schema = z.output<typeof schema>;

const state = reactive({
  attribute: undefined,
  password: undefined,
});

const isSubmitLoading = ref(false);
const handleSubmit = async (event: FormSubmitEvent<Schema>) => {
  try {
    isSubmitLoading.value = true;
    const res: any = await signIn('credentials', {
      attribute: event.data.attribute,
      password: event.data.password,
      redirect: false,
    });
    if (res.error) {
      throw new Error(res.error);
    }
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