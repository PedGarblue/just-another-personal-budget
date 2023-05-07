<script lang="ts" setup>
// import { format } from 'date-fns'
import { format } from 'date-fns'
import type { FilterOption, Header, SortType } from 'vue3-easy-data-table'
import transactions, { TransactionAPI } from '~~/api/transactions'
import { useAccounts } from '~~/stores/accounts'
import { DisplayTransaction } from '~~/types/transactionTypes'

const accounts = useAccounts()

// TODO: Date Range selector
// const startMonthDate = format(new Date(), 'yyyy-MM-01')

const transactionsAPIData = ref<TransactionAPI[]>([])

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

const displayTransactionsData = computed<DisplayTransaction[]>(() => {
  return transactionsAPIData
    ? transactionsAPIData.value.map((transaction) => {
        const account = accounts.getAccount(transaction.account)
        const newTransaction: DisplayTransaction = {
          ...transaction,
          dateFormatted: format(new Date(transaction.date), 'yyyy-MM-dd HH:mm'),
          key: transaction.id,
          accountData: account,
          amountWithCurrency: `${account.currencyData.symbol}${transaction.amount}`,
        }
        return newTransaction
      })
    : []
})

const accountCriteria = ref('All')
const showAccountFilter = ref(false)

const filterOptions = computed((): FilterOption[] => {
  const filterOptionArray: FilterOption[] = []
  if (accountCriteria.value !== 'All') {
    filterOptionArray.push({
      field: 'accountData.name',
      comparison: '=',
      criteria: accountCriteria.value,
    })
  }

  return filterOptionArray
})

const headers: Header[] = [
  {
    text: 'Date',
    value: 'dateFormatted',
    sortable: true,
  },
  {
    text: 'Description',
    value: 'description',
  },
  {
    text: 'Account',
    value: 'accountData.name',
  },
  {
    text: 'Amount',
    value: 'amountWithCurrency',
  },
  {
    text: 'Operation',
    value: 'operation',
  },
]

const sortBy: string[] = ['dateFormatted']
const sortType: SortType[] = ['desc']
onMounted(() => {
  getTransactions()
})
</script>
<template>
  <PageSection>
    <div class="flex flex-row w-full gap-4 mb-2">
      <SummaryTransactionsCreate @form-finished="() => refreshTable()" />
      <SummaryExchangesCreate @form-finished="() => refreshTable()" />
    </div>
    <EasyDataTable
      :headers="headers"
      :items="displayTransactionsData"
      :sort-by="sortBy"
      :sort-type="sortType"
      :filter-options="filterOptions"
      multi-sort
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
      <template #[`header-accountData.name`]>
        <Select
          v-model="accountCriteria"
          size="sm"
          default="All"
          :options="[
            'All',
            'Zinli',
            'Efectivo USD',
            'Mercantil Personal',
            'Reserve',
            'Binance',
          ]"
        />
      </template>
    </EasyDataTable>
  </PageSection>
</template>
