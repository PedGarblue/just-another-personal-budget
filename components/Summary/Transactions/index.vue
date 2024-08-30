<script lang="ts" setup>
import { useAccounts } from '~~/stores/accounts'

const accounts = useAccounts()

// TODO: Date Range selector
// const startMonthDate = format(new Date(), 'yyyy-MM-01')

// data refs
const accountCriteria = ref('All')

// computed
const accountsNames = computed(() => accounts.getAccountsNames)
const getSelectedAccount = computed(() => {
  return accounts.getAccounts.find(
    (account) => account.name === accountCriteria.value
  )
})

// methods
const refreshTable = () => {
  // should i be doing this?
  accounts.fetchAccounts()
}
</script>

<template>
  <PageSection>
    <div class="flex flex-col lg:flex-row w-full gap-4 mb-2">
      <SummaryTransactionsCreate @form-finished="() => refreshTable()" />
      <SummaryExchangesCreate @form-finished="() => refreshTable()" />
      <Select
        v-model="accountCriteria"
        size="sm"
        default="All"
        :options="['All', ...accountsNames]"
      />
      <SummaryCategoriesCreate class="ml-auto" />
    </div>
    <TransactionList :account-criteria="getSelectedAccount?.id">
      <template #item-operation="transaction">
        <div class="flex flex-row gap-1 justify-center">
          <SummaryTransactionsUpdate
            :transaction="transaction"
            @form-finished="() => refreshTable()"
          />
          <SummaryTransactionsDelete
            :transaction="transaction"
            @form-finished="() => refreshTable()"
          />
        </div>
      </template>
    </TransactionList>
  </PageSection>
</template>
