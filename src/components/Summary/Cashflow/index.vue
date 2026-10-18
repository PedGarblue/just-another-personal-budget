<script lang="ts" setup>
import { getCashflowSummary } from '@/api/cashflowSummary'
import type {
  CashflowPeriod,
  CashflowSummaryResponse,
} from '@/types/cashflowSummary'
import { useAccounts } from '@/stores/accounts'

const { t } = useLang()
const accountsStore = useAccounts()

const period = ref<CashflowPeriod>('current_month')
const periodOptions: CashflowPeriod[] = [
  'current_month',
  'this_quarter',
  'this_year',
]
const cashflowData = ref<CashflowSummaryResponse | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const currencyFormatter = computed(
  () =>
    new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
)

const dateRangeText = computed(() => {
  if (!cashflowData.value) return ''
  const fromDate = new Date(cashflowData.value.from_date)
  const toDate = new Date(cashflowData.value.to_date)
  const dateFormatter = new Intl.DateTimeFormat()
  return `${dateFormatter.format(fromDate)} - ${dateFormatter.format(toDate)}`
})

const hasMalformedTransactions = computed(
  () => (cashflowData.value?.malformed_transactions?.length || 0) > 0
)

const formattedIncome = computed(() =>
  currencyFormatter.value.format(cashflowData.value?.income_total_usd || 0)
)
const formattedExpense = computed(() =>
  currencyFormatter.value.format(cashflowData.value?.expense_total_usd || 0)
)
const formattedFreeCashflow = computed(() =>
  currencyFormatter.value.format(cashflowData.value?.free_cash_flow_usd || 0)
)

const fetchCashflowSummary = async () => {
  loading.value = true
  error.value = null
  try {
    const data = await getCashflowSummary(period.value)
    cashflowData.value = data
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch cashflow summary'
  } finally {
    loading.value = false
  }
}

watch(period, () => {
  fetchCashflowSummary()
})

onMounted(() => {
  fetchCashflowSummary()
})

defineExpose({
  refresh: fetchCashflowSummary,
})
</script>

<template>
  <PageSection v-if="accountsStore.getAccounts.length > 0">
    <PageSectionTitle :text="t('pages.summary.cashflow.title')" />

    <div class="mb-4 flex flex-wrap gap-2">
      <Button
        v-for="option in periodOptions"
        :key="option"
        :type="period === option ? 'primary' : 'secondary'"
        size="sm"
        @click="period = option"
      >
        {{ t(`pages.summary.cashflow.period.${option}`) }}
      </Button>
    </div>

    <div
      v-if="cashflowData"
      class="mb-4 text-sm text-gray-600 dark:text-gray-400"
    >
      {{ dateRangeText }}
    </div>

    <div v-if="loading" class="flex items-center justify-center py-8">
      <p class="text-gray-500">{{ t('pages.summary.cashflow.loading') }}</p>
    </div>

    <div
      v-if="error && !loading"
      class="mb-4 rounded-md bg-red-50 p-4 dark:bg-red-900/20"
    >
      <p class="text-red-800 dark:text-red-200">{{ error }}</p>
    </div>

    <div
      v-if="!loading && !error && cashflowData"
      class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <div class="rounded-md border p-4 dark:border-gray-700">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ t('pages.summary.cashflow.income_total') }}
        </p>
        <p class="text-xl font-semibold text-green-600 dark:text-green-400">
          ${{ formattedIncome }}
        </p>
      </div>

      <div class="rounded-md border p-4 dark:border-gray-700">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ t('pages.summary.cashflow.expense_total') }}
        </p>
        <p class="text-xl font-semibold text-red-600 dark:text-red-400">
          ${{ formattedExpense }}
        </p>
      </div>

      <div class="rounded-md border p-4 dark:border-gray-700">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ t('pages.summary.cashflow.free_cash_flow') }}
        </p>
        <p class="text-xl font-semibold text-blue-600 dark:text-blue-400">
          ${{ formattedFreeCashflow }}
        </p>
      </div>
    </div>

    <div
      v-if="hasMalformedTransactions && !loading && !error"
      class="mt-4 rounded-md border border-yellow-200 bg-yellow-50 p-4 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200"
    >
      {{ t('pages.summary.cashflow.malformed_warning') }}
    </div>
  </PageSection>
</template>
