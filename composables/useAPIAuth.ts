import { UseFetchOptions } from 'nuxt/app'
import { useAPI } from './useAPI'
import { useAuthStore } from '~/stores/auth'

export async function useAPIAuth<T>(
  url: string | (() => string),
  options: Omit<UseFetchOptions<T>, 'default'> & {
    default?: () => T | Ref<T>
  } = {} as any
) {
  // set the Authorization header with the access token
  const authStore = useAuthStore()

  // if there is an ongoing token refresh, wait for it to finish
  if (authStore.getRefreshTokenPromise) {
    await authStore.getRefreshTokenPromise
  }

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
