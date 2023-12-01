const onResponseError = async ({ response }: { response: any }) => {
  if (response.status === 401) {
    const { signOut } = useAuth();
    await signOut();
    await API.logout();
  }
};

type UseMyFetch = typeof useFetch;
export const useMyFetch: UseMyFetch = (path, options?) => {
  const { data } = useAuth();
  const runtimeConfig = useRuntimeConfig();
  return useFetch(path, {
    baseURL: runtimeConfig.public.backendURL as string,
    headers: {
      Authorization: `Bearer ${data.value?.user?.token}`,
    },
    ...options,
    onResponseError,
  });
};

type UseMy$Fetch = typeof $fetch.raw;
export const useMy$Fetch: UseMy$Fetch = (request, options?) => {
  const { data } = useAuth();
  const runtimeConfig = useRuntimeConfig();
  return $fetch(request, {
    baseURL: runtimeConfig.public.backendURL as string,
    headers: {
      Authorization: `Bearer ${data.value?.user?.token}`,
    },
    ...options,
    onResponseError
  });
};
