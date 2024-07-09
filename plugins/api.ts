import { useAuthStore } from '~~/stores/auth'

export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore()
  const runtimeConfig = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: runtimeConfig.public.apiUrl,
    onRequest({ request, options, error }) {
      if (authStore.token) {
        const headers = (options.headers ||= {})
        if (Array.isArray(headers)) {
          headers.push(['Authorization', `Bearer ${authStore.token.access}`])
        } else if (headers instanceof Headers) {
          headers.set('Authorization', `Bearer ${authStore.token.access}`)
        } else {
          headers.Authorization = `Bearer ${authStore.token.access}`
        }
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        await nuxtApp.runWithContext(() => navigateTo('/login'))
      }
    },
  })

  return {
    provide: {
      api,
    },
  }
})
