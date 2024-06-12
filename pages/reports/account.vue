<script lang="ts" setup>
import { useAccounts } from '~~/stores/accounts'
const accountsStore = useAccounts()

definePageMeta({
  layout: 'dashboard',
  name: 'reports.account',
})

useHead({
  title: 'Account Reports',
})

onMounted(() => {
  accountsStore.fetchData()
})
</script>
<template>
  <PageWrapper>
    <PageHeader>
      <PageTitle :text="$t('pages.reports.index.title')" class="capitalize" />
    </PageHeader>
    <PageBody>
      <ReportsAccount></ReportsAccount>
    </PageBody>
  </PageWrapper>
</template>
