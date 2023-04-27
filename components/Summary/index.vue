<script setup>
import { useAccounts } from '~/stores/accounts'

const accountsStore = useAccounts()

await accountsStore.fetchData()

const accountsData = computed(() => accountsStore.getAccounts)
</script>

<template>
  <PageSection>
    <div class="flex flex-row gap-4 pb-4">
      <div v-for="account in accountsData" :key="account.id">
        <SummaryAccount :account="account" />
      </div>
    </div>
    <SummaryTransactions />
  </PageSection>
</template>

<style></style>
