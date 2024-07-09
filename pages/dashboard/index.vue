<script lang="ts" setup>
import { useAccounts } from '~~/composables/useAccounts'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
})

useHead({
  title: 'Dashboard',
})

const accounts = useAccounts()
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
