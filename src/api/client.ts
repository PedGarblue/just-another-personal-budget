import { ofetch, type FetchOptions } from 'ofetch'
import { apiUrl } from '@/config'

type RetryOptions = FetchOptions & {
  _retried?: boolean
}

function setAuthorizationHeader(options: RetryOptions, accessToken: string) {
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

  ;(headers as Record<string, string>).Authorization = `Bearer ${accessToken}`
}

async function logoutAndRedirect() {
  const [{ useAuthStore }, { default: router }] = await Promise.all([
    import('@/stores/auth'),
    import('@/router'),
  ])
  useAuthStore().logout()
  await router.push({ name: 'login' })
}

export const api = ofetch.create({
  baseURL: apiUrl,
  async onResponseError({ request, response, options }) {
    if (response.status !== 401) return

    const url = String(request)
    if (url.includes('/token/')) return

    const fetchOptions = options as RetryOptions
    if (fetchOptions._retried) {
      await logoutAndRedirect()
      return
    }

    fetchOptions._retried = true

    try {
      const { useAuthStore } = await import('@/stores/auth')
      await useAuthStore().refreshToken()

      const accessToken = useAuthStore().getToken?.access
      if (accessToken) {
        setAuthorizationHeader(fetchOptions, accessToken)
      }

      return await api(request, fetchOptions)
    } catch {
      await logoutAndRedirect()
    }
  },
})
