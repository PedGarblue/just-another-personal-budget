import type { UseFetchOptions } from '#app'
import { fetchAPI, useAPI } from './useAPI'
import { useAuthStore } from '~/stores/auth'

function withAuthHeaders(
  options: Record<string, unknown>,
  accessToken?: string
): Record<string, unknown> {
  if (!accessToken) {
    return options
  }

  const headers = {
    ...(options.headers as Record<string, string> | undefined),
    Authorization: `Bearer ${accessToken}`,
  }

  return {
    ...options,
    headers,
  }
}

export async function useAPIAuth<T>(
  url: string | (() => string),
  options: Omit<UseFetchOptions<T>, 'default'> & {
    default?: () => T | Ref<T>
  } = {} as any
) {
  const authStore = useAuthStore()

  await authStore.ensureValidAccessToken()

  return useAPI(url, {
    ...options,
    onRequest({ request, options, error }) {
      if (authStore.getToken?.access) {
        const headers = (options.headers ||= {})
        if (Array.isArray(headers)) {
          headers.push([
            'Authorization',
            `Bearer ${authStore.getToken?.access}`,
          ])
        } else if (headers instanceof Headers) {
          headers.set('Authorization', `Bearer ${authStore.getToken?.access}`)
        } else {
          headers.Authorization = `Bearer ${authStore.getToken?.access}`
        }
      }
    },
  })
}

export async function fetchAPIAuth<T>(
  url: string,
  options: Record<string, unknown> = {}
): Promise<T> {
  const authStore = useAuthStore()
  await authStore.ensureValidAccessToken()

  return fetchAPI<T>(url, withAuthHeaders(options, authStore.getToken?.access))
}
