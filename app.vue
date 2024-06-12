<script lang="ts" setup>
import { AppSetup } from './utils/app'
import type { ITheme } from './utils/theme'
import { useNotificationsStore } from '~~/stores/notifications'
import { useTransactions } from '~~/stores/transactions'

AppSetup()

const theme = useState<ITheme>('theme.current')
const themeDark = ref<ITheme>('dark')
const locale = useState<string>('locale.setting')
const app = useAppConfig()
// use Notification display
const notificationStore = useNotificationsStore()
const notifications = computed(() => notificationStore.notifications)

const { fetchCategories } = useTransactions()

onMounted(() => {
  fetchCategories()
})

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
