<script lang="ts" setup>
import { format } from 'date-fns'
import { ServerOptions, type Header } from 'vue3-easy-data-table'
import type { TransactionAPI, TransactionListItem } from '~~/api/transactions'
import transactions, {
  isGroupItem,
  isTransactionItem,
} from '~~/api/transactions'
import { useAccounts } from '~~/stores/accounts'
import { useTransactions as useTransactionsStore } from '~~/stores/transactions'
import { convertColorValueToTailwindCompatible } from '~~/utils/colors'
import type { CategoryAPI } from '~~/types/categories'
import type {
  DisplayTransaction,
  DisplayTransactionGroup,
  DisplayTransactionListItem,
} from '~~/types/transactionTypes'

const emits = defineEmits<{
  (e: 'selection-change', ids: number[]): void
}>()

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
  /** Enable checkbox multi-select (dashboard create-group flow) */
  selectable: {
    type: Boolean,
    default: false,
  },
})

const { t } = useLang()

const serverOptions = ref<ServerOptions>({
  page: 1,
  rowsPerPage: 50,
})
const serverItemsLength = ref(0)
const loading = ref(false)

const items = ref<TransactionListItem[]>([])
/** Current-page selection; cleared on fetch. null disables checkboxes. */
const selectedItems = ref<DisplayTransactionListItem[]>([])

const accounts = useAccounts()
const transactionsStore = useTransactionsStore()

const categories = computed(() => transactionsStore.getCategories)

/** Lazy-loaded group members, keyed by group id */
const groupMembersCache = ref<Record<number, DisplayTransaction[]>>({})
const groupMembersLoading = ref<Record<number, boolean>>({})

function isSelectableRow(
  item: DisplayTransactionListItem
): item is DisplayTransaction {
  return item.type !== 'group' && (item.group == null || item.group === 0)
}

const itemsSelectedModel = computed({
  get(): DisplayTransactionListItem[] | null {
    return props.selectable ? selectedItems.value : null
  },
  set(value: DisplayTransactionListItem[] | null) {
    if (!props.selectable) return
    selectedItems.value = (value ?? []).filter(isSelectableRow)
  },
})

const selectedTransactionIds = computed(() =>
  selectedItems.value.filter(isSelectableRow).map((item) => item.id)
)

function clearSelection() {
  selectedItems.value = []
}

watch(
  selectedTransactionIds,
  (ids) => {
    emits('selection-change', ids)
  },
  { deep: true }
)

const headers = computed<Header[]>(() => [
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
    text: t('transactions.receivable'),
    value: 'receivableDisplay',
  },
  {
    text: t('transactions.operation'),
    value: 'operation',
  },
])

function receivableDisplayFor(transaction: TransactionAPI): string {
  const rid = transaction.receivable
  const contactLabel = transaction.contact?.trim()
  if (rid == null || rid === 0) return '—'
  const amt = Number(transaction.amount)
  if (Number.isNaN(amt)) {
    return contactLabel ? `${contactLabel} #${rid}` : `#${rid}`
  }
  const kind =
    amt < 0
      ? t('transactions.receivable_loan')
      : t('transactions.receivable_collection')
  if (contactLabel) return `${kind} · ${contactLabel}`
  return `${kind} #${rid}`
}

function toDisplayTransaction(transaction: TransactionAPI): DisplayTransaction {
  const account = accounts.getAccount(transaction.account)
  return {
    ...transaction,
    type: 'transaction',
    dateFormatted: format(new Date(transaction.date), 'yyyy-MM-dd HH:mm'),
    key: `transaction-${transaction.id}`,
    accountData: account,
    amountWithCurrency: `${account.currencyData.symbol}${transaction.amount}`,
    toMainCurrencyAmount: `$${transaction.to_main_currency_amount}`,
    categoryData: categories.value.find(
      (category: CategoryAPI) => category.id === transaction.category
    ),
    receivableDisplay: receivableDisplayFor(transaction),
  }
}

function toDisplayGroup(
  group: Extract<TransactionListItem, { type: 'group' }>
): DisplayTransactionGroup {
  const total = group.total_main_currency_amount
  const nativeTotal = group.total_amount
  const nativeCurrencyId = group.currency
  let amountWithCurrency = '—'
  if (nativeTotal != null && nativeCurrencyId != null) {
    const currency = accounts.getCurrency(nativeCurrencyId)
    amountWithCurrency = `${currency.symbol}${nativeTotal}`
  }
  return {
    ...group,
    type: 'group',
    key: `group-${group.id}`,
    dateFormatted: format(new Date(group.date), 'yyyy-MM-dd HH:mm'),
    description: group.name,
    amountWithCurrency,
    toMainCurrencyAmount: total != null ? `$${total}` : '—',
    countDisplay: t('transactions.group.count', {
      count: group.transaction_count,
    }),
    receivableDisplay: '—',
  }
}

const displayTransactionsData = computed<DisplayTransactionListItem[]>(() => {
  if (!items.value) return []
  return items.value.map((item) => {
    if (isGroupItem(item)) return toDisplayGroup(item)
    return toDisplayTransaction(item)
  })
})

const transactionsOnly = computed<TransactionAPI[]>(() =>
  items.value.filter(isTransactionItem)
)

const displayTransactionsOnly = computed<DisplayTransaction[]>(() =>
  displayTransactionsData.value.filter(
    (item): item is DisplayTransaction => item.type !== 'group'
  )
)

function listFetchParams(
  overrides: { group?: number; pageSize?: number } = {}
) {
  return {
    page: overrides.group ? 1 : serverOptions.value.page,
    pageSize: overrides.pageSize ?? serverOptions.value.rowsPerPage,
    currency: props.currencyCriteria > 0 ? props.currencyCriteria : undefined,
    account: props.accountCriteria > 0 ? props.accountCriteria : undefined,
    category: props.categoryCriteria > 0 ? props.categoryCriteria : undefined,
    from: props.fromDate !== '' ? props.fromDate : undefined,
    to: props.toDate !== '' ? props.toDate : undefined,
    group: overrides.group,
  }
}

function clearGroupMembersCache() {
  groupMembersCache.value = {}
  groupMembersLoading.value = {}
}

const fetchTransactions = async () => {
  loading.value = true
  clearGroupMembersCache()
  clearSelection()
  const fetched = await transactions(listFetchParams())
  if (fetched) {
    const { results, count } = fetched
    items.value = results
    serverItemsLength.value = count
  }
  loading.value = false
}

async function loadGroupMembers(groupId: number) {
  if (
    groupMembersCache.value[groupId] != null ||
    groupMembersLoading.value[groupId]
  ) {
    return
  }
  groupMembersLoading.value = {
    ...groupMembersLoading.value,
    [groupId]: true,
  }
  try {
    const fetched = await transactions(
      listFetchParams({ group: groupId, pageSize: 100 })
    )
    const members = (fetched?.results ?? [])
      .filter(isTransactionItem)
      .map(toDisplayTransaction)
    groupMembersCache.value = {
      ...groupMembersCache.value,
      [groupId]: members,
    }
  } catch {
    groupMembersCache.value = {
      ...groupMembersCache.value,
      [groupId]: [],
    }
  } finally {
    groupMembersLoading.value = {
      ...groupMembersLoading.value,
      [groupId]: false,
    }
  }
}

function onExpandRow(_index: number, item: DisplayTransactionListItem) {
  if (item.type === 'group') {
    loadGroupMembers(item.id)
  }
}

function isGroupRow(
  item: DisplayTransactionListItem
): item is DisplayTransactionGroup {
  return item.type === 'group'
}

function amountIsNegative(item: DisplayTransactionListItem): boolean {
  if (isGroupRow(item)) {
    if (item.total_amount != null) {
      return item.total_amount.includes('-')
    }
    return (item.total_main_currency_amount ?? '').includes('-')
  }
  return String(item.amount ?? '').includes('-')
}

function bodyItemClassName(column: string, rowNumber: number): string {
  const item = displayTransactionsData.value[rowNumber - 1]
  if (column === 'expand') {
    if (!item || item.type !== 'group') {
      return 'pointer-events-none opacity-0'
    }
    return ''
  }
  if (column === 'checkbox') {
    if (!item || !isSelectableRow(item)) {
      return 'pointer-events-none opacity-0'
    }
  }
  return ''
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

watch(
  () => [props.categoryCriteria, props.fromDate, props.toDate],
  () => {
    fetchTransactions()
  }
)

defineExpose({
  refreshTable: fetchTransactions,
  transactions: displayTransactionsOnly,
  transactionsRaw: transactionsOnly,
  selectedTransactionIds,
  clearSelection,
})

onMounted(() => {
  fetchTransactions()
})
</script>

<template>
  <EasyDataTable
    v-model:server-options="serverOptions"
    v-model:items-selected="itemsSelectedModel"
    :server-items-length="serverItemsLength"
    :headers="headers"
    :loading="loading"
    :items="displayTransactionsData"
    :rows-items="[50, 100]"
    :body-item-class-name="bodyItemClassName"
    @expand-row="onExpandRow"
  >
    <template #item-description="item">
      <span v-if="isGroupRow(item)" class="font-semibold">
        {{ item.description }}
      </span>
      <span v-else>{{ item.description }}</span>
    </template>

    <template #[`item-accountData.name`]="item">
      <span v-if="isGroupRow(item)">—</span>
      <span v-else>{{ item.accountData?.name }}</span>
    </template>

    <template #item-categoryData="item">
      <span v-if="isGroupRow(item)" class="text-sm text-muted-foreground">
        {{ item.countDisplay }}
      </span>
      <span
        v-else
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
      <span v-if="item.amountWithCurrency === '—'">—</span>
      <span
        v-else
        :class="{
          'text-green-500': !amountIsNegative(item),
          'text-red-500': amountIsNegative(item),
        }"
        class="font-bold"
      >
        {{ item.amountWithCurrency }}
      </span>
    </template>

    <template #item-toMainCurrencyAmount="item">
      <span
        :class="{
          'text-green-500':
            item.toMainCurrencyAmount !== '—' && !amountIsNegative(item),
          'text-red-500':
            item.toMainCurrencyAmount !== '—' && amountIsNegative(item),
        }"
        class="font-bold"
      >
        {{ item.toMainCurrencyAmount }}
      </span>
    </template>

    <template #item-receivableDisplay="item">
      {{ item.receivableDisplay }}
    </template>

    <template #item-operation="item">
      <slot v-if="!isGroupRow(item)" name="item-operation" v-bind="item" />
    </template>

    <template #expand="item">
      <div v-if="isGroupRow(item)" class="px-4 py-3 bg-muted/20">
        <p
          v-if="
            groupMembersLoading[item.id] || groupMembersCache[item.id] == null
          "
          class="text-sm text-muted-foreground"
        >
          {{ t('transactions.group.loading') }}
        </p>
        <p
          v-else-if="groupMembersCache[item.id].length === 0"
          class="text-sm text-muted-foreground"
        >
          {{ t('transactions.group.empty') }}
        </p>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-muted-foreground">
                <th class="py-1 pr-3 font-medium">
                  {{ t('transactions.date') }}
                </th>
                <th class="py-1 pr-3 font-medium">
                  {{ t('transactions.description') }}
                </th>
                <th class="py-1 pr-3 font-medium">
                  {{ t('transactions.account') }}
                </th>
                <th class="py-1 pr-3 font-medium">
                  {{ t('transactions.category') }}
                </th>
                <th class="py-1 pr-3 font-medium">
                  {{ t('transactions.amount') }}
                </th>
                <th class="py-1 pr-3 font-medium">
                  {{ t('transactions.to_main_currency_amount') }}
                </th>
                <th class="py-1 font-medium">
                  {{ t('transactions.operation') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="member in groupMembersCache[item.id]"
                :key="member.key"
                class="border-t border-border/60"
              >
                <td class="py-2 pr-3 whitespace-nowrap">
                  {{ member.dateFormatted }}
                </td>
                <td class="py-2 pr-3">
                  {{ member.description }}
                </td>
                <td class="py-2 pr-3">
                  {{ member.accountData?.name }}
                </td>
                <td class="py-2 pr-3">
                  <span
                    class="rounded-md px-2 py-0.5 text-black dark:text-white font-bold border-2 bg-opacity-30 text-xs"
                    :style="{
                      'background-color': convertColorValueToTailwindCompatible(
                        member.categoryData?.color
                      ),
                      'border-color': member.categoryData?.color,
                    }"
                  >
                    {{
                      member.categoryData
                        ? member.categoryData.name
                        : t('transactions.no_category')
                    }}
                  </span>
                </td>
                <td
                  class="py-2 pr-3 font-bold whitespace-nowrap"
                  :class="{
                    'text-green-500': !String(member.amount).includes('-'),
                    'text-red-500': String(member.amount).includes('-'),
                  }"
                >
                  {{ member.amountWithCurrency }}
                </td>
                <td
                  class="py-2 pr-3 font-bold whitespace-nowrap"
                  :class="{
                    'text-green-500': !String(member.amount).includes('-'),
                    'text-red-500': String(member.amount).includes('-'),
                  }"
                >
                  {{ member.toMainCurrencyAmount }}
                </td>
                <td class="py-2">
                  <slot name="item-operation" v-bind="member" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </EasyDataTable>
</template>
