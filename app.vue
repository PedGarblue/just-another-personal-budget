<script lang="ts" setup>
import { AppConfigInput } from '@nuxt/schema'
import { AppSetup } from './utils/app'
import { ITheme } from './utils/theme'
import { useNotificationsStore } from '~~/stores/notifications'
AppSetup()
const theme = useState<ITheme>('theme.current')
const locale = useState<string>('locale.setting')
const app = useAppConfig() as AppConfigInput
// use Notification display
const notificationStore = useNotificationsStore()
const notifications = computed(() => notificationStore.notifications)

useHead({
  title: app.name,
  titleTemplate: '%s - BUDareGET',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    {
      hid: 'budareget',
      name: 'budareget',
      content: 'Personal Finances App',
    },
  ],
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
})
</script>

<template>
  <Html :class="`${theme === 'dark' ? 'dark' : ''}`" :lang="locale">
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
