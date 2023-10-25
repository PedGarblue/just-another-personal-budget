<script lang="ts" setup>
import transactions, { TransactionAPI } from '~~/api/transactions'
import { useAccounts } from '~~/stores/accounts'

const accounts = useAccounts()

// TODO: Date Range selector
// const startMonthDate = format(new Date(), 'yyyy-MM-01')

// data refs
const transactionsAPIData = ref<TransactionAPI[]>([])
const accountCriteria = ref('All')

// computed
const accountsNames = computed(() => accounts.getAccountsNames)

// methods

const getTransactions = async () => {
  const response = await transactions()
  if (response) {
    transactionsAPIData.value = response
  }
}

const refreshTable = () => {
  getTransactions()
  // should i be doing this?
  accounts.fetchAccounts()
}

// lifecycle
onMounted(() => {
  getTransactions()
})
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
    </div>
    <TransactionList
      :transactions="transactionsAPIData"
      :account-criteria="accountCriteria"
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
