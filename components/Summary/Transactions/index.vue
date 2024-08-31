<script lang="ts" setup>
import { useAccounts } from '~~/stores/accounts'
import TransactionList from '~~/components/Transaction/List.vue'

// TODO: Date Range selector
// const startMonthDate = format(new Date(), 'yyyy-MM-01')

// data refs
const accountCriteria = ref('All')
const transactionList = ref<InstanceType<typeof TransactionList> | null>(null)
const accounts = useAccounts()

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
  transactionList.value?.refreshTable()
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
    <TransactionList
      ref="transactionList"
      :account-criteria="getSelectedAccount?.id"
    >
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
