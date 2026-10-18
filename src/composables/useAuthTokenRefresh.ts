import { useDocumentVisibility } from '@vueuse/core'
import { useAuthStore } from '@/stores/auth'

export function useAuthTokenRefresh() {
  const authStore = useAuthStore()
  const router = useRouter()
  let tokenRefreshInterval: ReturnType<typeof setInterval> | null = null

  const unsubscribeTokenRefresh = authStore.$onAction(({ name, onError }) => {
    if (name === 'refreshToken') {
      onError(() => {
        if (tokenRefreshInterval) {
          clearInterval(tokenRefreshInterval)
        }
        router.push({ name: 'login' })
      })
    }
  })

  const visibility = useDocumentVisibility()

  watch(visibility, (value) => {
    if (value === 'visible') {
      authStore.ensureValidAccessToken()
    }
  })

  onMounted(() => {
    authStore.checkAndRefreshToken()
    tokenRefreshInterval = setInterval(() => {
      authStore.checkAndRefreshToken()
    }, 60 * 1000)
  })

  onUnmounted(() => {
    if (tokenRefreshInterval) {
      clearInterval(tokenRefreshInterval)
    }
    unsubscribeTokenRefresh()
  })
}
