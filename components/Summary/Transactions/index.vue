<script lang="ts" setup>
import { X } from 'lucide-vue-next'
import { useAccounts } from '~~/stores/accounts'
import { useTransactions } from '~~/stores/transactions'
import TransactionList from '~~/components/Transaction/List.vue'
import type { CategoryAPI } from '~~/types/categories'
import { convertColorValueToTailwindCompatible } from '~~/utils/colors'

// TODO: Date Range selector
// const startMonthDate = format(new Date(), 'yyyy-MM-01')

const ALL_CATEGORIES = {
  id: 0,
  name: 'All',
  color: '#000000',
  type: 'expense',
} as CategoryAPI

const emits = defineEmits([
  'transaction-changed',
  'clear-filters',
  'category-filter-changed',
])

const props = defineProps({
  categoryCriteria: {
    type: Number,
    required: false,
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

const { t } = useLang()

// data refs
const accountCriteria = ref('All')
const transactionList = ref<InstanceType<typeof TransactionList> | null>(null)
const accounts = useAccounts()
const transactionsStore = useTransactions()

// computed
const accountsNames = computed(() => accounts.getAccountsNames)
const categoryOptions = computed(() => [
  ALL_CATEGORIES,
  ...transactionsStore.getCategories,
])
const selectedCategory = computed(() => {
  if (props.categoryCriteria === 0) {
    return ALL_CATEGORIES
  }
  return transactionsStore.getCategory(props.categoryCriteria) ?? ALL_CATEGORIES
})
const getSelectedAccount = computed(() => {
  return accounts.getAccounts.find(
    (account) => account.name === accountCriteria.value
  )
})

// computed
const hasActiveFilters = computed(() => {
  return (
    props.categoryCriteria > 0 || props.fromDate !== '' || props.toDate !== ''
  )
})

// methods
const refreshTable = () => {
  // should i be doing this?
  accounts.fetchData()
  transactionList.value?.refreshTable()
  // emit event to notify parent that transactions have changed
  emits('transaction-changed')
}

const clearFilters = () => {
  emits('clear-filters')
}

const onCategoryChange = (option: CategoryAPI | string) => {
  const id =
    typeof option === 'object' && option !== null && 'id' in option
      ? option.id
      : 0
  emits('category-filter-changed', id)
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
        required
      />
      <Select
        v-if="categoryOptions.length > 1"
        :model-value="selectedCategory"
        :options="categoryOptions"
        selection-key="name"
        size="sm"
        required
        @selection="onCategoryChange"
      >
        <template #item-value="{ option }">
          <span
            v-if="typeof option === 'object' && option.id > 0"
            class="inline-flex items-center gap-2"
          >
            <span
              class="inline-block h-2.5 w-2.5 rounded-full border"
              :style="{
                'background-color': convertColorValueToTailwindCompatible(
                  option.color
                ),
                'border-color': option.color,
              }"
            />
            {{ option.name }}
          </span>
          <span v-else>{{ option.name }}</span>
        </template>
      </Select>
      <Button
        v-if="hasActiveFilters"
        type="secondary"
        size="sm"
        class="flex items-center gap-2"
        @click="clearFilters"
      >
        <X class="h-4 w-4" />
        {{ t('pages.summary.transactions.clear_filters') }}
      </Button>
    </div>
    <TransactionList
      ref="transactionList"
      :account-criteria="getSelectedAccount?.id || 0"
      :category-criteria="props.categoryCriteria"
      :from-date="props.fromDate"
      :to-date="props.toDate"
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
