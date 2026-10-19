<script lang="ts" setup>
import {
  TabGroup,
  TabList,
  Tab as HeadlessUiTab,
  TabPanels,
  TabPanel,
} from '@headlessui/vue'
import Settle from '@/components/ExpenseShare/Settle.vue'
import PartnersList from '@/components/ExpenseShare/PartnersList.vue'
import HistoryList from '@/components/ExpenseShare/HistoryList.vue'

const { t } = useLang()

useHead({
  title: 'Expense Share',
})

const tabs = computed(() => [
  { key: 'settle', label: t('pages.expenseShare.tabs.settle') },
  { key: 'partners', label: t('pages.expenseShare.tabs.partners') },
  { key: 'history', label: t('pages.expenseShare.tabs.history') },
])
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
      <TabGroup>
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
            <Settle />
          </TabPanel>
          <TabPanel>
            <PartnersList />
          </TabPanel>
          <TabPanel>
            <HistoryList />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </PageBody>
  </PageWrapper>
</template>
