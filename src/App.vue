<script lang="ts" setup>
import { AppSetup } from '@/utils/app'
import type { ITheme } from '@/utils/theme'
import { useNotificationsStore } from '@/stores/notifications'
import { appConfig } from '@/appConfig'
import PageLayout from '@/layouts/page.vue'
import DashboardLayout from '@/layouts/dashboard.vue'

AppSetup()

const theme = useState<ITheme>('theme.current')
const locale = useState<string>('locale.setting')
const notificationStore = useNotificationsStore()
const route = useRoute()
const router = useRouter()

const notifications = computed(() => notificationStore.notifications)
const layout = computed(() =>
  route.meta.layout === 'dashboard' ? DashboardLayout : PageLayout
)
const navigating = ref(false)

useAuthTokenRefresh()

watch(
  [theme, locale],
  () => {
    document.documentElement.classList.toggle('dark', theme.value === 'dark')
    document.documentElement.lang = locale.value || 'en'
  },
  { immediate: true }
)

router.beforeEach(() => {
  navigating.value = true
})
router.afterEach(() => {
  navigating.value = false
})

useHead({
  title: appConfig.name,
  titleTemplate: '%s - Just Another Personal Budget App',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    {
      name: 'japb',
      content: 'Just Another Personal Budget',
    },
  ],
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
})
</script>

<template>
  <div
    class="antialiased duration-300 transition-colors text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900"
  >
    <div
      v-if="navigating"
      class="fixed top-0 left-0 right-0 z-50 h-[5px] bg-primary-500"
    />
    <component :is="layout">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </component>
    <Notification
      v-for="notification in notifications"
      :key="notification.id"
      :type="notification.type"
      :text="notification.text"
    />
  </div>
</template>
