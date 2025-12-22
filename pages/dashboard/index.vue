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

// method to refresh expenses summary when transactions change
const refreshExpensesSummary = () => {
  expensesSummaryRef.value?.refresh()
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
      <SummaryExpenses ref="expensesSummaryRef" />
      <SummaryPendingPurchases />
      <SummaryTransactions
        v-if="accountsStore.getAccounts.length > 0"
        @transaction-changed="refreshExpensesSummary"
      />
    </PageBody>
  </PageWrapper>
</template>
