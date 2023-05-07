<script setup>
import { useAccounts } from '~/stores/accounts'

const accountsStore = useAccounts()

await accountsStore.fetchData()

const accountsData = computed(() => accountsStore.getAccounts)
</script>

<template>
  <PageSection>
    <div class="flex flex-row flex-wrap gap-4 pb-4">
      <div
        v-for="account in accountsData"
        :key="account.id"
        class="w-[48%] lg:w-auto"
      >
        <SummaryAccountsItem :account="account" />
      </div>
    </div>
  </PageSection>
</template>

<style></style>
