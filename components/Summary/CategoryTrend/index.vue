<script lang="ts" setup>
import { Line } from 'vue-chartjs'
import { format, subMonths, startOfMonth } from 'date-fns'
import VueDatePicker from '@vuepic/vue-datepicker'
import { getCategoryTrend } from '~~/api/categoryTrend'
import type {
  CategoryTrendResponse,
  CategoryTrendGranularity,
} from '~~/types/categoryTrend'
import { useTransactions } from '~~/stores/transactions'
import { useAccounts } from '~~/stores/accounts'
import type { CategoryAPI } from '~~/types/categories'

useChartjs()

const { t } = useLang()
const accountsStore = useAccounts()
const transactionsStore = useTransactions()

const FALLBACK_COLORS = [
  '#3b82f6',
  '#ef4444',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#f97316',
  '#14b8a6',
  '#6366f1',
  '#84cc16',
  '#e11d48',
]

type ViewMode = 'total' | 'children'

const trendData = ref<CategoryTrendResponse | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const viewMode = ref<ViewMode>('total')
const granularity = ref<CategoryTrendGranularity>('monthly')
const startDate = ref<string>(
  format(startOfMonth(subMonths(new Date(), 6)), 'yyyy-MM-dd')
)
const endDate = ref<string>(format(new Date(), 'yyyy-MM-dd'))

const parentCategories = computed(() =>
  transactionsStore.getCategories.filter(
    (cat) => !cat.parent_category && cat.type === 'expense'
  )
)

const selectedCategory = ref<CategoryAPI | null>(null)

const initDefaultCategory = () => {
  if (selectedCategory.value || parentCategories.value.length === 0) return

  const food = parentCategories.value.find(
    (cat) => cat.name.toLowerCase() === 'food'
  )
  selectedCategory.value = food || parentCategories.value[0]
}

const chartData = computed(() => {
  if (!trendData.value || !trendData.value.periods.length) {
    return { labels: [], datasets: [] }
  }

  const periods = trendData.value.periods
  const labels = periods.map((p) => p.label)

  if (viewMode.value === 'total') {
    const parentColor = selectedCategory.value?.color || FALLBACK_COLORS[0]
    return {
      labels,
      datasets: [
        {
          label: trendData.value.category_name,
          data: periods.map((p) => Number(p.total_amount_usd)),
          borderColor: parentColor,
          backgroundColor: parentColor,
          tension: 0.3,
          fill: false,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    }
  }

  const childMap = new Map<number, { name: string; color: string }>()
  for (const period of periods) {
    for (const child of period.children) {
      if (!childMap.has(child.category_id)) {
        const stored = transactionsStore.getCategories.find(
          (c) => c.id === child.category_id
        )
        childMap.set(child.category_id, {
          name: child.category_name,
          color: stored?.color || '',
        })
      }
    }
  }

  let colorIdx = 0
  const datasets = Array.from(childMap.entries()).map(
    ([categoryId, { name, color }]) => {
      const resolvedColor =
        color || FALLBACK_COLORS[colorIdx++ % FALLBACK_COLORS.length]
      return {
        label: name,
        data: periods.map((p) => {
          const child = p.children.find((c) => c.category_id === categoryId)
          return child ? Number(child.total_amount_usd) : 0
        }),
        borderColor: resolvedColor,
        backgroundColor: resolvedColor,
        tension: 0.3,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    }
  )

  return { labels, datasets }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index',
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value: any) => `$${Number(value).toFixed(0)}`,
      },
    },
  },
  plugins: {
    legend: {
      display: viewMode.value === 'children',
      position: 'bottom' as const,
    },
    tooltip: {
      callbacks: {
        label: (context: any) =>
          `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`,
      },
    },
  },
}))

const dateRangeText = computed(() => {
  if (!trendData.value) return ''
  const from = new Date(trendData.value.start_date)
  const to = new Date(trendData.value.end_date)
  return `${format(from, 'MMM dd, yyyy')} - ${format(to, 'MMM dd, yyyy')}`
})

const hasMalformedTransactions = computed(
  () =>
    trendData.value?.malformed_transactions &&
    trendData.value.malformed_transactions.length > 0
)

const fetchTrend = async () => {
  if (!selectedCategory.value) return

  loading.value = true
  error.value = null
  try {
    const data = await getCategoryTrend({
      category: selectedCategory.value.id,
      start_date: startDate.value,
      end_date: endDate.value,
      granularity: granularity.value,
    })
    trendData.value = data
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch category trend'
    console.error('Error fetching category trend:', err)
  } finally {
    loading.value = false
  }
}

const onStartDateChange = (val: any) => {
  if (val) {
    startDate.value = format(new Date(val), 'yyyy-MM-dd')
  }
}

const onEndDateChange = (val: any) => {
  if (val) {
    endDate.value = format(new Date(val), 'yyyy-MM-dd')
  }
}

const onCategoryChange = (cat: CategoryAPI | string) => {
  if (typeof cat === 'object' && cat !== null) {
    selectedCategory.value = cat
  }
}

watch([selectedCategory, startDate, endDate, granularity], () => {
  fetchTrend()
})

watch(parentCategories, () => {
  initDefaultCategory()
})

onMounted(() => {
  initDefaultCategory()
  if (selectedCategory.value) {
    fetchTrend()
  }
})

defineExpose({
  refresh: fetchTrend,
})
</script>

<template>
  <PageSection v-if="accountsStore.getAccounts.length > 0">
    <PageSectionTitle :text="t('pages.summary.category_trend.title')" />

    <!-- Controls -->
    <div class="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end">
      <!-- Category Selector -->
      <div class="w-full lg:w-48">
        <label class="mb-1 block text-sm text-gray-600 dark:text-gray-400">
          {{ t('pages.summary.category_trend.category_label') }}
        </label>
        <Select
          v-if="parentCategories.length > 0"
          :model-value="selectedCategory"
          :options="parentCategories"
          selection-key="name"
          size="sm"
          required
          @selection="onCategoryChange"
        >
          <template #item-value="{ option }">
            {{ option.name }}
          </template>
        </Select>
        <p v-else class="text-sm text-gray-500">
          {{ t('pages.summary.category_trend.no_categories') }}
        </p>
      </div>

      <!-- Granularity Toggle -->
      <div>
        <label class="mb-1 block text-sm text-gray-600 dark:text-gray-400">
          {{ t('pages.summary.category_trend.granularity_label') }}
        </label>
        <div class="flex gap-2">
          <Button
            :type="granularity === 'monthly' ? 'primary' : 'secondary'"
            size="sm"
            @click="granularity = 'monthly'"
          >
            {{ t('pages.summary.category_trend.granularity.monthly') }}
          </Button>
          <Button
            :type="granularity === 'weekly' ? 'primary' : 'secondary'"
            size="sm"
            @click="granularity = 'weekly'"
          >
            {{ t('pages.summary.category_trend.granularity.weekly') }}
          </Button>
        </div>
      </div>

      <!-- View Mode Toggle -->
      <div>
        <label class="mb-1 block text-sm text-gray-600 dark:text-gray-400">
          {{ t('pages.summary.category_trend.view_mode_label') }}
        </label>
        <div class="flex gap-2">
          <Button
            :type="viewMode === 'total' ? 'primary' : 'secondary'"
            size="sm"
            @click="viewMode = 'total'"
          >
            {{ t('pages.summary.category_trend.view_mode.total') }}
          </Button>
          <Button
            :type="viewMode === 'children' ? 'primary' : 'secondary'"
            size="sm"
            @click="viewMode = 'children'"
          >
            {{ t('pages.summary.category_trend.view_mode.children') }}
          </Button>
        </div>
      </div>

      <!-- Date Range -->
      <div class="flex gap-2">
        <div>
          <label class="mb-1 block text-sm text-gray-600 dark:text-gray-400">
            {{ t('pages.summary.category_trend.start_date') }}
          </label>
          <VueDatePicker
            :model-value="startDate"
            :enable-time-picker="false"
            format="yyyy-MM-dd"
            auto-apply
            class="w-40"
            @update:model-value="onStartDateChange"
          />
        </div>
        <div>
          <label class="mb-1 block text-sm text-gray-600 dark:text-gray-400">
            {{ t('pages.summary.category_trend.end_date') }}
          </label>
          <VueDatePicker
            :model-value="endDate"
            :enable-time-picker="false"
            format="yyyy-MM-dd"
            auto-apply
            class="w-40"
            @update:model-value="onEndDateChange"
          />
        </div>
      </div>
    </div>

    <!-- Date Range Text -->
    <div v-if="trendData" class="mb-4 text-sm text-gray-600 dark:text-gray-400">
      {{ dateRangeText }}
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-8">
      <p class="text-gray-500">
        {{ t('pages.summary.category_trend.loading') }}
      </p>
    </div>

    <!-- Error -->
    <div
      v-if="error && !loading"
      class="mb-4 rounded-md bg-red-50 p-4 dark:bg-red-900/20"
    >
      <p class="text-red-800 dark:text-red-200">{{ error }}</p>
    </div>

    <!-- Grand Total -->
    <div v-if="!loading && !error && trendData" class="mb-6">
      <p class="text-gray-500">
        {{
          t('pages.summary.category_trend.grand_total', {
            amount: trendData.grand_total_usd.toFixed(2),
          })
        }}
      </p>
    </div>

    <!-- Chart -->
    <div v-if="!loading && !error && trendData" class="mb-6">
      <div
        v-if="trendData.periods.length === 0"
        class="py-8 text-center text-gray-500"
      >
        {{ t('pages.summary.category_trend.no_data') }}
      </div>
      <div v-else class="h-72">
        <Line :data="chartData" :options="chartOptions" />
      </div>
    </div>

    <!-- Malformed Transactions -->
    <div
      v-if="hasMalformedTransactions"
      class="mt-6 rounded-md border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20"
    >
      <h3 class="mb-2 font-semibold text-yellow-800 dark:text-yellow-200">
        {{ t('pages.summary.category_trend.malformed.title') }}
      </h3>
      <ul class="space-y-2">
        <li
          v-for="transaction in trendData?.malformed_transactions"
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
