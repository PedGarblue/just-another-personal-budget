import type { UseFetchOptions } from '#app'
import { useAPI } from './useAPI'
import { useAuthStore } from '~/stores/auth'

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
