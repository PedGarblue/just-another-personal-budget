<script lang="ts" setup>
import { AppSetup } from './utils/app'
import type { ITheme } from './utils/theme'
import { useAuthStore } from './stores/auth'
import { useNotificationsStore } from '~~/stores/notifications'

AppSetup()

const theme = useState<ITheme>('theme.current')
const themeDark = ref<ITheme>('dark')
const locale = useState<string>('locale.setting')
const app = useAppConfig()
const notificationStore = useNotificationsStore()
const authStore = useAuthStore()

const notifications = computed(() => notificationStore.notifications)

let tokenRefreshInterval: NodeJS.Timeout | null = null

useHead({
  title: app.name,
  titleTemplate: '%s - Just Another Personal Budget App',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    {
      hid: 'japb',
      name: 'japb',
      content: 'Just Another Personal Budget',
    },
  ],
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
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
})
</script>

<template>
  <Html :class="`${theme === themeDark ? themeDark : ''}`" :lang="locale">
    <Body
      class="antialiased duration-300 transition-colors text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900"
    >
      <NuxtLayout>
        <NuxtLoadingIndicator :height="5" :duration="3000" :throttle="400" />
        <NuxtPage />
        <Notification
          v-for="notification in notifications"
          :key="notification.id"
          :type="notification.type"
          :text="notification.text"
        />
      </NuxtLayout>
    </Body>
  </Html>
</template>
