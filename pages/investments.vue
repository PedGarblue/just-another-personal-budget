<script lang="ts" setup>
import { useAccounts } from '~~/composables/useAccounts'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const accounts = useAccounts()

useHead({
  title: 'Investments',
})
</script>

<template>
  <PageWrapper>
    <PageHeader>
      <PageTitle
        :text="$t('pages.investments.index.title')"
        class="capitalize"
      />
    </PageHeader>
    <PageBody>
      <Receivables></Receivables>
    </PageBody>
  </PageWrapper>
</template>
