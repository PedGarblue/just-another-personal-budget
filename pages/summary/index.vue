<script lang="ts" setup>
import { useAccounts } from '~/stores/accounts'

definePageMeta({
  layout: 'dashboard',
})

const accountsStore = useAccounts()

await accountsStore.fetchData()

const accountsData = accountsStore.getAccounts
</script>

<template>
  <PageWrapper>
    <PageHeader>
      <PageTitle :text="$t('pages.summary.index.title')" class="capitalize" />
    </PageHeader>
    <PageBody>
      <PageSection>
        <div class="flex flex-row gap-4">
          <div v-for="account in accountsData" :key="account.id">
            <SummaryAccount :account="account" />
          </div>
        </div>
      </PageSection>
      <PageSection>
        <SummaryTransactions />
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>
