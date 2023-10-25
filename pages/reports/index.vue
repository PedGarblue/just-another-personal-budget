<script lang="ts" setup>
import { useAccounts } from '~~/stores/accounts'
const accountsStore = useAccounts()

definePageMeta({
  layout: 'dashboard',
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
      <Reports></Reports>
    </PageBody>
  </PageWrapper>
</template>
