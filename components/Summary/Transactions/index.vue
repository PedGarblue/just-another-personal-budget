<script lang="ts" setup>
// import { format } from 'date-fns'
import { format } from 'date-fns'
import type { Header } from 'vue3-easy-data-table'
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
          dateFormatted: format(new Date(transaction.date), 'yyyy-MM-dd hh:mm'),
          key: transaction.id,
          accountData: account,
          amountWithCurrency: `${account.currencyData.name}.${transaction.amount}`,
        }
        return newTransaction
      })
    : []
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
    sortable: true,
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

onMounted(() => {
  getTransactions()
})
</script>
<template>
  <div>
    <div class="flex flex-row w-full gap-4 mb-2">
      <SummaryTransactionsCreate @form-finished="() => refreshTable()" />
      <SummaryExchangesCreate @form-finished="() => refreshTable()" />
    </div>
    <EasyDataTable :headers="headers" :items="displayTransactionsData">
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
    </EasyDataTable>
  </div>
</template>
