<script setup>
import { useAccounts } from '~/stores/accounts'
import DataPill from '~~/components/generic/DataPill.vue'

const accountsStore = useAccounts()

await accountsStore.fetchData()

const currenciesData = computed(() => accountsStore.getCurrenciesWithAccounts)
</script>

<template>
  <PageSection>
    <div>
      <h2 class="text-xl font-bold py-2">Accounts Balance</h2>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div
          v-for="currency in currenciesData"
          :key="currency.id"
          class="p-2 bg-gray-100 rounded-md border-2 border-gray-200"
        >
          <DataPill
            :title="currency.name"
            :text="`${currency.symbol}${currency.balance}`"
          />
          <div class="flex flex-col flex-wrap gap-4 pb-4 pt-4 pl-4">
            <div
              v-for="account in currency.accounts"
              :key="account.id"
              class="lg:w-auto"
            >
              <SummaryAccountsItem :account="account" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageSection>
</template>

<style></style>
