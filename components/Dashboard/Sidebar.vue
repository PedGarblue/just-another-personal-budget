<script lang="ts" setup>
import IconUilApps from '~icons/uil/apps'
import IconMdiCashFast from '~icons/mdi/cash-fast'
import IconMdiFile from '~icons/mdi/file'

export interface IMenuItem {
  type: 'link' | 'button'
  text: string
  href?: any
  route?: any
  icon: {
    obj: any
    classes?: string
  }
}

const props = defineProps({
  mode: {
    type: String,
    default: 'normal',
  },
})
const { t } = useLang()

const route = useRoute()
const sidebar = ref(null)
const menus = computed((): IMenuItem[] => [
  {
    type: 'link',
    text: t('pages.dashboard.index.nav'),
    route: { name: 'dashboard' },
    icon: {
      obj: IconUilApps,
    },
  },
  {
    type: 'link',
    text: t('pages.reports.nav'),
    route: { name: 'reports' },
    icon: {
      obj: IconMdiFile,
    },
  },
  {
    type: 'link',
    text: t('pages.investments.nav'),
    route: { name: 'investments' },
    icon: {
      obj: IconMdiCashFast,
    },
  },
])

onMounted(() => {
  // const { onScroll } = useSticky(sidebar.value, -1000)
  // setTimeout(() => onScroll(), 50)
})
</script>

<template>
  <div
    ref="sidebar"
    :class="{
      'fixed top-0 hidden pt-12 lg:flex lg:w-60 xl:w-80 h-screen':
        mode === 'normal',
      'relative flex-1 flex flex-col w-full': mode === 'mobile',
    }"
  >
    <div class="flex-1 overflow-y-auto pl-4 lg:pl-0 pr-4 py-4">
      <ul>
        <li v-for="(menu, i) in menus" :key="i">
          <Anchor
            v-if="menu.type === 'link'"
            :to="menu.route ? menu.route : undefined"
            :href="menu.href ? menu.href : undefined"
            class="group flex items-center mb-4 hover:no-underline"
          >
            <div
              class="flex items-center mr-4 px-2 py-2 rounded-md ring-1 ring-slate-900/5 shadow-sm group-hover:shadow group-hover:ring-slate-900/10 dark:ring-0 dark:shadow-none dark:group-hover:shadow-none dark:group-hover:highlight-white/10 group-hover:shadow-sky-200 dark:highlight-white/10"
              :class="{
                'text-white dark:text-white group-hover:bg-sky-500 bg-sky-500':
                  route.name === menu.route.name,
                'text-slate-500 dark:text-gray-100 group-hover:bg-gray-200 bg-gray-100 dark:group-hover:bg-slate-600 dark:bg-slate-700':
                  route.name !== menu.route.name,
              }"
            >
              <component
                :is="menu.icon.obj"
                class="text-xs"
                :class="[menu.icon.classes]"
              />
            </div>
            <span
              class="text-sm font-semibold capitalize"
              :class="{
                'font-extrabold text-sky-500 dark:text-sky-400':
                  route.name === menu.route.name,
              }"
            >
              {{ menu.text }}
            </span>
          </Anchor>
        </li>
      </ul>
    </div>
  </div>
</template>
