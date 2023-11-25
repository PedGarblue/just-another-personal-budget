<script lang="ts" setup>
import { useAccounts } from '~~/composables/useAccounts'
import { useTransactions } from '~~/stores/transactions'

definePageMeta({
  layout: 'dashboard',
})

const accounts = useAccounts()
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
      <SummaryTransactions />
    </PageBody>
  </PageWrapper>
</template>
