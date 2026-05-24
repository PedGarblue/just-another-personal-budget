<script lang="ts" setup>
import { useAccounts } from '~/stores/accounts'
import { useTransactions } from '~~/stores/transactions'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
})

useHead({
  title: 'Dashboard',
})

const accountsStore = useAccounts()
const { fetchCategories } = useTransactions()

// refs for components that need to be refreshed
const expensesSummaryRef = ref<InstanceType<typeof SummaryExpenses> | null>(
  null
)
const categoryTrendRef = ref<InstanceType<typeof SummaryCategoryTrend> | null>(
  null
)
const cashflowSummaryRef = ref<InstanceType<typeof SummaryCashflow> | null>(
  null
)

// transaction filter state
const transactionCategoryFilter = ref<number>(0)
const transactionFromDate = ref<string>('')
const transactionToDate = ref<string>('')

// method to refresh expenses summary when transactions change
const refreshExpensesSummary = () => {
  expensesSummaryRef.value?.refresh()
  categoryTrendRef.value?.refresh()
  cashflowSummaryRef.value?.refresh()
}

// handle category selection from expenses chart
const handleCategorySelected = (data: {
  categoryId: number
  fromDate: string
  toDate: string
}) => {
  transactionCategoryFilter.value = data.categoryId
  transactionFromDate.value = data.fromDate
  transactionToDate.value = data.toDate
}

// handle clear filters
const handleClearFilters = () => {
  transactionCategoryFilter.value = 0
  transactionFromDate.value = ''
  transactionToDate.value = ''
}

onMounted(() => {
  fetchCategories()
})
</script>

<template>
  <PageWrapper>
    <PageHeader>
      <PageTitle :text="$t('pages.dashboard.index.title')" class="capitalize" />
    </PageHeader>
    <PageBody>
      <SummaryAccounts />
      <SummaryExpenses
        ref="expensesSummaryRef"
        @category-selected="handleCategorySelected"
      />
      <SummaryCashflow ref="cashflowSummaryRef" />
      <SummaryCategoryTrend ref="categoryTrendRef" />
      <SummaryTransactions
        v-if="accountsStore.getAccounts.length > 0"
        :category-criteria="transactionCategoryFilter"
        :from-date="transactionFromDate"
        :to-date="transactionToDate"
        @transaction-changed="refreshExpensesSummary"
        @clear-filters="handleClearFilters"
        @category-filter-changed="(id) => (transactionCategoryFilter = id)"
      />
    </PageBody>
  </PageWrapper>
</template>
