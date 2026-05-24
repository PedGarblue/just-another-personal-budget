import type { UseFetchOptions } from 'nuxt/app'
import { toAPIError } from '~~/utils/apiError'

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

export async function fetchAPI<T>(
  url: string,
  options: Record<string, unknown> = {}
): Promise<T> {
  try {
    return await useNuxtApp().$api<T>(url, options)
  } catch (error) {
    throw toAPIError(error)
  }
}
