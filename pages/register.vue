<template>
  <div class="min-h-screen flex items-center">
    <div class="container">
      <div class="max-w-md mx-auto">
        <h1 class="main-title text-center">Register</h1>
        <UForm :schema="schema" :state="state" class="grid sm:grid-cols-2 gap-4" @submit="handleSubmit">
          <UFormGroup label="First name" name="firstname" required>
            <UInput v-model="state.firstname" type="password"/>
          </UFormGroup>
          <UFormGroup label="Last name" name="lastname" required>
            <UInput v-model="state.lastname" type="password"/>
          </UFormGroup>
          <UFormGroup label="Email" name="email" required class="col-span-full">
            <UInput v-model="state.email"/>
          </UFormGroup>
          <UFormGroup label="Username" name="username" required class="col-span-full">
            <UInput v-model="state.username"/>
          </UFormGroup>
          <UFormGroup label="Password" name="password" required class="col-span-full">
            <UInput v-model="state.password" type="password"/>
          </UFormGroup>
          <UFormGroup label="Confirm password" name="confirmPassword" required class="col-span-full">
            <UInput v-model="state.confirmPassword" type="password"/>
          </UFormGroup>
          <p class="text-center col-span-full">
            Have an account?
            <NuxtLink to="/login" class="underline">Login</NuxtLink>
          </p>
          <UButton type="submit" :loading="isSubmitLoading" block class="col-span-full">Submit</UButton>
        </UForm>
      </div>
    </div>

    <ModalEnterOTP ref="modalEnterOtpRef" />
  </div>
</template>

<script setup lang="ts">
import {z} from 'zod';
import type {FormSubmitEvent} from '#ui/types';

definePageMeta({
  layout: 'empty',
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/',
  },
});

const toast = useToast();
const schema = z.object({
  email: z.string().min(1, 'Email is required').email(),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(8, 'Must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Must be at least 8 characters'),
  firstname: z.string().min(1, 'First name is required'),
  lastname: z.string().min(1, 'Last name is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type Schema = z.output<typeof schema>;

const state = reactive({
  email: undefined,
  username: undefined,
  password: undefined,
  confirmPassword: undefined,
  firstname: undefined,
  lastname: undefined,
});

const modalEnterOtpRef = ref();
const isSubmitLoading = ref(false);
const handleSubmit = async (event: FormSubmitEvent<Schema>) => {
  try {
    isSubmitLoading.value = true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {confirmPassword, ...data} = event.data;
    await API.register(data);
    toast.add({
      title: 'Account created',
      color: 'green',
    })
    // navigateTo('/login');
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
