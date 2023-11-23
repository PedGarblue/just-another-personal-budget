<script lang="ts" setup>
import { useAccounts } from '~~/composables/useAccounts'
import { useCategories } from '~~/composables/useCategories'

definePageMeta({
  layout: 'dashboard',
})

const accounts = useAccounts()
const { categories, loadCategories } = useCategories()

provide('categories', categories)

onMounted(() => {
  loadCategories()
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
