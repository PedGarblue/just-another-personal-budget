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
      <SummaryPendingPurchases />
      <SummaryTransactions v-if="accountsStore.getAccounts.length > 0" />
    </PageBody>
  </PageWrapper>
</template>
