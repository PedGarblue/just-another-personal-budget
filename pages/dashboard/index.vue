<script lang="ts" setup>
import { useAccounts } from '~/stores/accounts'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
})

useHead({
  title: 'Dashboard',
})

const accountsStore = useAccounts()
</script>

<template>
  <PageWrapper>
    <PageHeader>
      <PageTitle :text="$t('pages.dashboard.index.title')" class="capitalize" />
    </PageHeader>
    <PageBody>
      <SummaryAccounts />
      <SummaryTransactions v-if="accountsStore.getAccounts.length > 0" />
    </PageBody>
  </PageWrapper>
</template>
