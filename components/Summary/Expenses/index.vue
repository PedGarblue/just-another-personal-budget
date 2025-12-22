<script lang="ts" setup>
import { Bar } from 'vue-chartjs'
import { format } from 'date-fns'
import { getExpensesSummary } from '~~/api/expenses'
import type { ExpensesSummaryResponse, ExpensesPeriod } from '~~/types/expenses'
import { useTransactions } from '~~/stores/transactions'
import { useAccounts } from '~~/stores/accounts'

const { t } = useLang()
const accountsStore = useAccounts()
const transactionsStore = useTransactions()

// data refs
const period = ref<ExpensesPeriod>('current_month')
const periodOptions: ExpensesPeriod[] = ['current_week', 'current_month']
const expensesData = ref<ExpensesSummaryResponse | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

// computed
const chartData = computed(() => {
  if (!expensesData.value || !expensesData.value.summary.length) {
    return {
      labels: [],
      datasets: [],
    }
  }

  const categories = expensesData.value.summary
  const labels = categories.map((cat) => cat.category_name)
  const amounts = categories.map((cat) => Number(cat.total_amount_usd))

  // Get colors from categories store if available
  const backgroundColor = labels.map((label) => {
    const category = transactionsStore.getCategories.find(
      (cat) => cat.name === label
    )
    return category?.color || '#3b82f6' // Default blue color
  })

  return {
    labels,
    datasets: [
      {
        label: t('pages.summary.expenses.chart.label'),
        data: amounts,
        backgroundColor,
        borderColor: backgroundColor,
        borderWidth: 1,
      },
    ],
  }
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (value: any) {
          return `$${value.toFixed(2)}`
        },
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          return `$${context.parsed.y.toFixed(2)}`
        },
      },
    },
  },
})

const dateRangeText = computed(() => {
  if (!expensesData.value) return ''
  const fromDate = new Date(expensesData.value.from_date)
  const toDate = new Date(expensesData.value.to_date)
  return `${format(fromDate, 'MMM dd, yyyy')} - ${format(
    toDate,
    'MMM dd, yyyy'
  )}`
})

const hasMalformedTransactions = computed(() => {
  return (
    expensesData.value?.malformed_transactions &&
    expensesData.value.malformed_transactions.length > 0
  )
})

// methods
const fetchExpensesSummary = async () => {
  loading.value = true
  error.value = null
  try {
    const data = await getExpensesSummary(period.value)
    expensesData.value = data
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch expenses summary'
    console.error('Error fetching expenses summary:', err)
  } finally {
    loading.value = false
  }
}

// watch period changes
watch(period, () => {
  fetchExpensesSummary()
})

// fetch on mount
onMounted(() => {
  fetchExpensesSummary()
})

// expose refresh method for parent components
defineExpose({
  refresh: fetchExpensesSummary,
})
</script>

<template>
  <PageSection v-if="accountsStore.getAccounts.length > 0">
    <PageSectionTitle :text="t('pages.summary.expenses.title')" />

    <!-- Period Switcher -->
    <div class="mb-4 flex flex-wrap gap-2">
      <Button
        v-for="option in periodOptions"
        :key="option"
        :type="period === option ? 'primary' : 'secondary'"
        size="sm"
        @click="period = option"
      >
        {{ t(`pages.summary.expenses.period.${option}`) }}
      </Button>
    </div>

    <!-- Date Range -->
    <div
      v-if="expensesData"
      class="mb-4 text-sm text-gray-600 dark:text-gray-400"
    >
      {{ dateRangeText }}
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-8">
      <p class="text-gray-500">{{ t('pages.summary.expenses.loading') }}</p>
    </div>

    <!-- Error State -->
    <div
      v-if="error && !loading"
      class="mb-4 rounded-md bg-red-50 p-4 dark:bg-red-900/20"
    >
      <p class="text-red-800 dark:text-red-200">{{ error }}</p>
    </div>

    <!-- Chart -->
    <div v-if="!loading && !error && expensesData" class="mb-6">
      <div
        v-if="expensesData.summary.length === 0"
        class="py-8 text-center text-gray-500"
      >
        {{ t('pages.summary.expenses.no_data') }}
      </div>
      <div v-else class="h-64">
        <Bar :data="chartData" :options="chartOptions" />
      </div>
    </div>

    <!-- Malformed Transactions -->
    <div
      v-if="hasMalformedTransactions"
      class="mt-6 rounded-md border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20"
    >
      <h3 class="mb-2 font-semibold text-yellow-800 dark:text-yellow-200">
        {{ t('pages.summary.expenses.malformed.title') }}
      </h3>
      <ul class="space-y-2">
        <li
          v-for="transaction in expensesData?.malformed_transactions"
          :key="transaction.id"
          class="text-sm text-yellow-700 dark:text-yellow-300"
        >
          <span class="font-medium">{{ transaction.description }}</span>
          <span class="mx-2">-</span>
          <span>{{ transaction.reason }}</span>
          <span class="mx-2">-</span>
          <span>{{ format(new Date(transaction.date), 'MMM dd, yyyy') }}</span>
        </li>
      </ul>
    </div>
  </PageSection>
</template>
