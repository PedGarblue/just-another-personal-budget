<script lang="ts" setup>
import { useAuthStore } from '~~/stores/auth'

export interface IMenuItemRule {
  validate: () => boolean
}

export interface IMenuItem {
  type: 'link' | 'button'
  text: string
  href?: any
  route?: any
  rules: IMenuItemRule[]
}

const rules = {
  isLoggedIn: (): IMenuItemRule => ({
    validate: () => auth.isLoggedIn,
  }),
  notLoggedIn: (): IMenuItemRule => ({
    validate: () => !auth.isLoggedIn,
  }),
}

const validateRules = (rules: IMenuItemRule[]): boolean => {
  return rules.every((rule) => rule.validate())
}

const { t } = useLang()
const app = useAppConfig()
const auth = useAuthStore()
const menus = computed((): IMenuItem[] => [
  {
    type: 'link',
    text: t('pages.login.nav'),
    route: { name: 'login' },
    rules: [rules.notLoggedIn()],
  },
  {
    type: 'link',
    text: t('pages.sign-up.nav'),
    route: { name: 'sign-up' },
    rules: [rules.notLoggedIn()],
  },
  {
    type: 'button',
    text: t('pages.dashboard.nav'),
    route: { name: 'dashboard' },
    rules: [rules.isLoggedIn()],
  },
])
</script>

<template>
  <BuilderNavbar>
    <template #banner>
      <div
        class="text-white text-xs text-center py-1 px-4 lg:px-8 bg-primary-500 capitalize"
      >
        <span class="mr-1">
          {{ $t('banners.welcome', { app_name: app.name }) }}
          <Anchor
            class="underline font-bold"
            :text="$t('others.learn_more')"
            href="https://github.com/PedGarblue/just-another-personal-budget"
          />
        </span>
      </div>
    </template>
    <template #menu>
      <div class="relative hidden lg:flex items-center ml-auto">
        <nav
          class="text-sm leading-6 font-semibold text-gray-600 dark:text-gray-300"
          role="navigation"
        >
          <ul class="flex items-center space-x-8">
            <template v-for="(item, i) in menus" :key="i">
              <li v-if="validateRules(item.rules)">
                <Anchor
                  v-if="item.type === 'link'"
                  :to="item.route ? item.route : undefined"
                  :href="item.href ? item.href : undefined"
                  class="hover:no-underline hover:text-slate-900 hover:dark:text-white capitalize"
                  >{{ item.text }}</Anchor
                >
                <Button
                  v-else-if="item.type === 'button'"
                  :text="item.text"
                  size="xs"
                  class="font-extrabold capitalize"
                  :to="item.route ? item.route : undefined"
                  :href="item.href ? item.href : undefined"
                />
              </li>
            </template>
          </ul>
        </nav>
        <div
          class="flex space-x-4 border-l ml-6 pl-6 border-gray-900/10 dark:border-gray-50/[0.2]"
        >
          <LanguageSwitcher />
          <ThemeSwitcher />
          <Anchor
            class="hover:no-underline hover:text-slate-900 hover:dark:text-white text-lg flex self-center items-center"
            href="https://github.com/PedGarblue"
            title="Github"
          >
            <IconMdi:github-face />
          </Anchor>
        </div>
      </div>
    </template>
    <template #options="{ toggleOptions }">
      <ActionSheet @on-close="toggleOptions(false)">
        <ActionSheetBody>
          <ActionSheetHeader text="Menu" />
          <nav class="leading-6 font-semibold text-gray-600 dark:text-gray-300">
            <ul class="flex flex-col">
              <template v-for="(item, i) in menus" :key="i">
                <li
                  v-if="validateRules(item.rules)"
                  class="flex w-full"
                  :class="{
                    'pb-2 mb-2 border-b border-gray-900/10 dark:border-gray-50/[0.2]':
                      item.type === 'link',
                  }"
                >
                  <Anchor
                    v-if="item.type === 'link'"
                    :to="item.route ? item.route : undefined"
                    :href="item.href ? item.href : undefined"
                    class="flex-1 hover:no-underline capitalize"
                    >{{ item.text }}</Anchor
                  >
                  <Button
                    v-else-if="item.type === 'button'"
                    :text="item.text"
                    size="xs"
                    class="flex-1 font-extrabold capitalize"
                    :to="item.route ? item.route : undefined"
                    :href="item.href ? item.href : undefined"
                  />
                </li>
              </template>
            </ul>
          </nav>
          <div class="mt-6 text-sm font-bold capitalize">
            {{ $t('components.theme_switcher.change_theme') }}
          </div>
          <div class="mt-2">
            <ThemeSwitcher type="select-box" />
          </div>
          <div class="mt-6 text-sm font-bold capitalize">
            {{ $t('components.language_switcher.change_language') }}
          </div>
          <div class="mt-2">
            <LanguageSwitcher type="select-box" />
          </div>
        </ActionSheetBody>
        <Button
          type="secondary"
          title="Github"
          href="https://github.com/PedGarblue"
        >
          <IconMdi:github-face />
          <span class="ml-1">Github</span>
        </Button>
        <Button
          text="Close"
          type="secondary"
          @click.prevent="toggleOptions(false)"
        />
      </ActionSheet>
    </template>
  </BuilderNavbar>
</template>
