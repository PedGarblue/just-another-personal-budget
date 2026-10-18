import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useState } from '@/composables/useState'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/pages/index.vue'),
    meta: { layout: 'page', public: true },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login.vue'),
    meta: { layout: 'page', public: true },
  },
  {
    path: '/sign-up',
    name: 'sign-up',
    component: () => import('@/pages/sign-up.vue'),
    meta: { layout: 'page', public: true },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/pages/dashboard/index.vue'),
    meta: { layout: 'dashboard' },
  },
  {
    path: '/reports/account',
    name: 'reports.account',
    component: () => import('@/pages/reports/account.vue'),
    meta: { layout: 'dashboard' },
  },
  {
    path: '/reports/currency',
    name: 'reports.currency',
    component: () => import('@/pages/reports/currency.vue'),
    meta: { layout: 'dashboard' },
  },
  {
    path: '/investments',
    name: 'investments',
    component: () => import('@/pages/investments.vue'),
    meta: { layout: 'dashboard' },
  },
  {
    path: '/expense-share',
    name: 'expense-share',
    component: () => import('@/pages/expense-share.vue'),
    meta: { layout: 'dashboard' },
  },
  {
    path: '/products',
    name: 'products',
    component: () => import('@/pages/products/index.vue'),
    meta: { layout: 'dashboard' },
  },
  {
    path: '/setting',
    name: 'setting',
    component: () => import('@/pages/setting.vue'),
    meta: { layout: 'page' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/pages/404.vue'),
    meta: { layout: 'page', public: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  if (to.meta.public) return true

  const auth = useAuthStore()
  if (!auth.getToken?.access) return { name: 'login' }

  try {
    await auth.ensureValidAccessToken()
  } catch {
    return { name: 'login' }
  }

  if (!auth.isLoggedIn) return { name: 'login' }
  return true
})

router.afterEach(() => {
  const showDrawer = useState<boolean>('navbar.showDrawer', () => false)
  const showOptions = useState<boolean>('navbar.showOptions', () => false)
  showDrawer.value = false
  showOptions.value = false
})

export default router
