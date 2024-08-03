<script lang="ts" setup>
import { useAccounts } from '~~/stores/accounts'
import { useTransactions } from '~~/stores/transactions'

const accountsStore = useAccounts()
const transactionsStore = useTransactions()

definePageMeta({
  layout: 'dashboard',
  name: 'reports.currency',
  middleware: 'auth',
})

useHead({
  title: 'Currency Reports',
})

onMounted(() => {
  accountsStore.fetchData()
  transactionsStore.fetchCategories()
})
</script>
<template>
  <PageWrapper>
    <PageHeader>
      <PageTitle :text="$t('pages.reports.index.title')" class="capitalize" />
    </PageHeader>
    <PageBody>
      <ReportsCurrency></ReportsCurrency>
    </PageBody>
  </PageWrapper>
</template>
