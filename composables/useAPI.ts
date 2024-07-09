import type { UseFetchOptions } from 'nuxt/app'

export function useAPI<T>(
  url: string | (() => string),
  options: Omit<UseFetchOptions<T>, 'default'> & {
    default?: () => T | Ref<T>
  } = {} as any
) {
  return useFetch(url, {
    ...options,
    $fetch: useNuxtApp().$api,
  })
}
