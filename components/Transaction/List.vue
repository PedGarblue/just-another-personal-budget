<script lang="ts" setup>
import { format } from 'date-fns'
import type { PropType } from 'vue'
import type { FilterOption, Header, SortType } from 'vue3-easy-data-table'
import type { TransactionAPI } from '~~/api/transactions'
import { useAccounts } from '~~/stores/accounts'
import { useTransactions } from '~~/stores/transactions'
import { convertColorValueToTailwindCompatible } from '~~/utils/colors'
import type { CategoryAPI } from '~~/types/categories'
import type { DisplayTransaction } from '~~/types/transactionTypes'

const accounts = useAccounts()
const transactionsStore = useTransactions()

const categories = computed(() => transactionsStore.getCategories)

// props

const props = defineProps({
  transactions: {
    type: Array as PropType<TransactionAPI[]>,
    required: true,
  },
  accountCriteria: {
    type: String,
    default: 'All',
  },
  currencyCriteria: {
    type: String,
    default: 'All',
  },
})

// data

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
    text: 'Category',
    value: 'categoryData',
  },
  {
    text: 'Amount',
    value: 'amountWithCurrency',
    sortable: true,
  },
  {
    text: 'Operation',
    value: 'operation',
  },
]

const sortBy: string[] = ['dateFormatted']
const sortType: SortType[] = ['desc']

// computed

const filterOptions = computed((): FilterOption[] => {
  const filterOptionArray: FilterOption[] = []
  if (props.accountCriteria !== 'All') {
    filterOptionArray.push({
      field: 'accountData.name',
      comparison: '=',
      criteria: props.accountCriteria,
    })
  }
  if (props.currencyCriteria !== 'All') {
    filterOptionArray.push({
      field: 'accountData.currencyData.name',
      comparison: '=',
      criteria: props.currencyCriteria,
    })
  }

  return filterOptionArray
})

const displayTransactionsData = computed<DisplayTransaction[]>(() => {
  return props.transactions
    ? props.transactions.map((transaction) => {
        const account = accounts.getAccount(transaction.account)
        const newTransaction: DisplayTransaction = {
          ...transaction,
          dateFormatted: format(new Date(transaction.date), 'yyyy-MM-dd HH:mm'),
          key: transaction.id,
          accountData: account,
          amountWithCurrency: `${account.currencyData.symbol}${transaction.amount}`,
          categoryData: categories.value.find(
            (category: CategoryAPI) => category.id === transaction.category
          ),
        }
        return newTransaction
      })
    : []
})
// methods
</script>

<template>
  <EasyDataTable
    :headers="headers"
    :items="displayTransactionsData"
    :sort-by="sortBy"
    :sort-type="sortType"
    :filter-options="filterOptions"
    multi-sort
  >
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>

    <template #item-categoryData="item">
      <span
        class="rounded-md px-2 py-1 text-black dark:text-white font-bold border-2 bg-opacity-30"
        :style="{
          'background-color': convertColorValueToTailwindCompatible(
            item.categoryData?.color
          ),
          'border-color': item.categoryData?.color,
        }"
      >
        {{ item.categoryData?.name }}
      </span>
    </template>

    <template #item-amountWithCurrency="item">
      <span
        :class="{
          'text-green-500': !item.amount.includes('-'),
          'text-red-500': item.amount.includes('-'),
        }"
        class="font-bold"
      >
        {{ item.amountWithCurrency }}
      </span>
    </template>
  </EasyDataTable>
</template>
