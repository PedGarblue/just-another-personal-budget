<script lang="ts" setup>
import {
  TabGroup,
  TabList,
  Tab as HeadlessUiTab,
  TabPanels,
  TabPanel,
} from '@headlessui/vue'
import Settle from '~~/components/ExpenseShare/Settle.vue'
import PartnersList from '~~/components/ExpenseShare/PartnersList.vue'
import HistoryList from '~~/components/ExpenseShare/HistoryList.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const { t } = useLang()

useHead({
  title: 'Expense Share',
})

const settleRef = ref<InstanceType<typeof Settle> | null>(null)
const partnersRef = ref<InstanceType<typeof PartnersList> | null>(null)
const historyRef = ref<InstanceType<typeof HistoryList> | null>(null)

const tabs = computed(() => [
  { key: 'settle', label: t('pages.expenseShare.tabs.settle') },
  { key: 'partners', label: t('pages.expenseShare.tabs.partners') },
  { key: 'history', label: t('pages.expenseShare.tabs.history') },
])

function onTabChange(index: number) {
  if (index === 0) settleRef.value?.refreshPartners()
  if (index === 1) partnersRef.value?.refresh()
  if (index === 2) historyRef.value?.refresh()
}
</script>

<template>
  <PageWrapper>
    <PageHeader>
      <PageTitle
        :text="$t('pages.expenseShare.index.title')"
        class="capitalize"
      />
    </PageHeader>
    <PageBody>
      <TabGroup @change="onTabChange">
        <TabList class="flex gap-2 mb-6 border-b border-border">
          <HeadlessUiTab
            v-for="tab in tabs"
            :key="tab.key"
            v-slot="{ selected }"
            as="template"
          >
            <button
              type="button"
              class="px-4 py-2 text-sm font-semibold border-b-2 -mb-px outline-none"
              :class="
                selected
                  ? 'border-sky-500 text-sky-500'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              "
            >
              {{ tab.label }}
            </button>
          </HeadlessUiTab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Settle ref="settleRef" />
          </TabPanel>
          <TabPanel>
            <PartnersList ref="partnersRef" />
          </TabPanel>
          <TabPanel>
            <HistoryList ref="historyRef" />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </PageBody>
  </PageWrapper>
</template>
