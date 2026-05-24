import { useAuthStore } from '~/stores/auth'

type FetchOptionsWithRetry = Parameters<typeof $fetch>[1] & {
  _retried?: boolean
}

function setAuthorizationHeader(
  options: FetchOptionsWithRetry,
  accessToken: string
) {
  const headers = (options.headers ||= {})

  if (Array.isArray(headers)) {
    options.headers = [
      ...headers.filter(([key]) => key.toLowerCase() !== 'authorization'),
      ['Authorization', `Bearer ${accessToken}`],
    ]
    return
  }

  if (headers instanceof Headers) {
    headers.set('Authorization', `Bearer ${accessToken}`)
    return
  }

  headers.Authorization = `Bearer ${accessToken}`
}

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: runtimeConfig.public.apiUrl,
    async onResponseError({ request, response, options }) {
      if (response.status !== 401) return

      const url = String(request)
      if (url.includes('/token/')) return

      const fetchOptions = options as FetchOptionsWithRetry
      if (fetchOptions._retried) {
        await nuxtApp.runWithContext(async () => {
          useAuthStore().logout()
          await navigateTo('/login')
        })
        return
      }

      fetchOptions._retried = true

      try {
        await nuxtApp.runWithContext(async () => {
          await useAuthStore().refreshToken()
        })

        const accessToken = useAuthStore().getToken?.access
        if (accessToken) {
          setAuthorizationHeader(fetchOptions, accessToken)
        }

        return await api(request, fetchOptions)
      } catch {
        await nuxtApp.runWithContext(async () => {
          useAuthStore().logout()
          await navigateTo('/login')
        })
      }
    },
  })

  return {
    provide: {
      api,
    },
  }
})
