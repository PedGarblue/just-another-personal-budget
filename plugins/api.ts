export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: runtimeConfig.public.apiUrl,
    onRequest({ request, options, error }) {},
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
