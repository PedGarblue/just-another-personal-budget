<script lang="ts" setup>
import { format } from 'date-fns'
import type { PropType } from 'vue'
import {
  ServerOptions,
  type FilterOption,
  type Header,
  type SortType,
} from 'vue3-easy-data-table'
import type { TransactionAPI } from '~~/api/transactions'
import { useAccounts } from '~~/stores/accounts'
import { useTransactions as useTransactionsStore } from '~~/stores/transactions'
import { convertColorValueToTailwindCompatible } from '~~/utils/colors'
import type { CategoryAPI } from '~~/types/categories'
import type { DisplayTransaction } from '~~/types/transactionTypes'
import transactions from '~~/api/transactions'

// props

const props = defineProps({
  accountCriteria: {
    type: Number,
    required: false,
    default: 0,
  },
  currencyCriteria: {
    type: Number,
    default: 0,
  },
  fromDate: {
    type: String,
    required: false,
    default: '',
  },
  toDate: {
    type: String,
    required: false,
    default: '',
  },
})

// data

const { t } = useLang()

const serverOptions = ref<ServerOptions>({
  page: 1,
  rowsPerPage: 50,
})
const serverItemsLength = ref(0)
const loading = ref(false)

const items = ref<TransactionAPI[]>([])

const accounts = useAccounts()
const transactionsStore = useTransactionsStore()

const categories = computed(() => transactionsStore.getCategories)

const headers: Header[] = [
  {
    text: t('transactions.date'),
    value: 'dateFormatted',
  },
  {
    text: t('transactions.description'),
    value: 'description',
  },
  {
    text: t('transactions.account'),
    value: 'accountData.name',
  },
  {
    text: t('transactions.category'),
    value: 'categoryData',
  },
  {
    text: t('transactions.amount'),
    value: 'amountWithCurrency',
  },
  {
    text: t('transactions.to_main_currency_amount'),
    value: 'toMainCurrencyAmount',
  },
  {
    text: t('transactions.operation'),
    value: 'operation',
  },
]

// computed

const displayTransactionsData = computed<DisplayTransaction[]>(() => {
  return items.value
    ? items.value.map((transaction) => {
        const account = accounts.getAccount(transaction.account)
        const newTransaction: DisplayTransaction = {
          ...transaction,
          dateFormatted: format(new Date(transaction.date), 'yyyy-MM-dd HH:mm'),
          key: transaction.id,
          accountData: account,
          amountWithCurrency: `${account.currencyData.symbol}${transaction.amount}`,
          toMainCurrencyAmount: `$${transaction.to_main_currency_amount}`,
          categoryData: categories.value.find(
            (category: CategoryAPI) => category.id === transaction.category
          ),
        }
        return newTransaction
      })
    : []
})
// methods
const fetchTransactions = async () => {
  loading.value = true
  const fetched = await transactions({
    page: serverOptions.value.page,
    pageSize: serverOptions.value.rowsPerPage,
    currency: props.currencyCriteria > 0 ? props.currencyCriteria : undefined,
    account: props.accountCriteria > 0 ? props.accountCriteria : undefined,
    from: props.fromDate !== '' ? props.fromDate : undefined,
    to: props.toDate !== '' ? props.toDate : undefined,
  })
  if (fetched) {
    const { results, count } = fetched
    items.value = results
    serverItemsLength.value = count
  }
  loading.value = false
}
watch(
  () => serverOptions.value,
  () => {
    fetchTransactions()
  },
  {
    deep: true,
  }
)

watch(
  () => props.accountCriteria,
  () => {
    fetchTransactions()
  }
)

defineExpose({
  refreshTable: fetchTransactions,
  transactions: displayTransactionsData,
  transactionsRaw: items,
})

onMounted(() => {
  fetchTransactions()
})
</script>

<template>
  <EasyDataTable
    v-model:server-options="serverOptions"
    :server-items-length="serverItemsLength"
    :headers="headers"
    :loading="loading"
    :items="displayTransactionsData"
    :rows-items="[50, 100]"
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
        {{
          item.categoryData
            ? item.categoryData.name
            : t('transactions.no_category')
        }}
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

    <template #item-toMainCurrencyAmount="item">
      <span
        :class="{
          'text-green-500': !item.amount.includes('-'),
          'text-red-500': item.amount.includes('-'),
        }"
        class="font-bold"
      >
        {{ item.toMainCurrencyAmount }}
      </span>
    </template>
  </EasyDataTable>
</template>
