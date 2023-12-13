import { ofetch } from 'ofetch';

export default defineNuxtPlugin((_nuxtApp) => {
  const runtimeConfig = useRuntimeConfig();
  globalThis.$fetch = ofetch.create({
    baseURL: runtimeConfig.public.backendURL as string,
    onRequest({ options }) {
      options.headers = useRequestHeaders(['cookie']) as HeadersInit;
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        const { signOut } = useAuth();
        await signOut();
        await API.logout();
      }
    },
  });
});
