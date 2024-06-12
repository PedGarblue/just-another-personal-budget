<script lang="ts" setup>
import { useAccounts } from '~~/stores/accounts'
const accountsStore = useAccounts()

definePageMeta({
  layout: 'dashboard',
  name: 'reports.currency',
})

useHead({
  title: 'Currency Reports',
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
      <ReportsCurrency></ReportsCurrency>
    </PageBody>
  </PageWrapper>
</template>
