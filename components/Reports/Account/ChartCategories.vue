<script setup lang="ts">
import { Doughnut, Bar } from 'vue-chartjs'
import type { PropType } from 'vue'
import { PieChart, BarChart3 } from 'lucide-vue-next'
import type { TransactionAPI } from '~~/api/transactions'
import { useTransactions } from '~~/stores/transactions'

type CategoryGroupItem = {
  [key: string]: {
    amount: number
    color: string
  }
}

type ChartTypes = 'Doughnut' | 'Bar'

const props = defineProps({
  transactions: {
    type: Array as PropType<TransactionAPI[]>,
    required: true,
  },
})

const chartType = ref<ChartTypes>('Doughnut')
const chartTypeList: ChartTypes[] = ['Doughnut', 'Bar']
const chartTypeIcons = {
  Doughnut: PieChart,
  Bar: BarChart3,
}
const chartsAvailable = {
  Doughnut,
  Bar,
}
const currentChart = computed(() => chartsAvailable[chartType.value])

const transactionsStore = useTransactions()

const chartOptions = ref({
  responsive: true,
})

const groupByCategory = (transactions: TransactionAPI[]) => {
  const grouped = transactions.reduce(
    (acc, transaction) => {
      const amount = Number(transaction.amount)
      const category = transactionsStore.getCategory(transaction.category || 0)
      if (!category) {
        acc['No Category'].amount += amount

        return acc
      }
      if (!acc[category.name]) {
        acc[category.name] = {
          amount: 0,
          color: category.color,
        }
      }
      acc[category.name].amount += amount
      return acc
    },
    { 'No Category': { amount: 0, color: 'fafafa' } } as CategoryGroupItem
  )
  const groupedSorted = Object.fromEntries(
    Object.entries(grouped).sort(([, a], [, b]) => b.amount - a.amount)
  )
  return groupedSorted
}

const toChartData = (transactions: TransactionAPI[]) => {
  const groups = groupByCategory(transactions)
  const labels = Object.keys(groups)
  const values = Object.values(groups).map((item) => item.amount)
  const backgroundColor = labels.map((label) => {
    const category = categories.value.find(
      (category) => category.name === label
    )
    return category ? category.color : '#fafafa'
  })
  const datasets = [
    {
      label: 'Dataset',
      data: Object.values(values),
      backgroundColor,
      borderColor: ['#a0a0a0'],
    },
  ]
  return { labels, datasets }
}

const categories = computed(() => {
  return transactionsStore.getCategories
})

const expensesByCategory = computed(() => {
  return toChartData(
    props.transactions
      .filter((transaction) => Number(transaction.amount) < 0)
      // make absolute value
      .map((transaction) => ({
        ...transaction,
        amount: Math.abs(Number(transaction.amount)).toString(),
      }))
  )
})

const incomeByCategory = computed(() => {
  return toChartData(
    props.transactions.filter((transaction) => Number(transaction.amount) > 0)
  )
})
</script>

<template>
  <div
    class="grid grid-cols-1 md:grid-cols-2 max-w-full justify-center gap-10 md:gap-4"
  >
    <div class="col-span-2">
      <Button
        v-for="type in chartTypeList"
        :key="type"
        class="inline-flex mr-1"
        type="secondary"
        size="sm"
        @click="chartType = type"
      >
        <component :is="chartTypeIcons[type]" class="h-4" />
      </Button>
    </div>
    <div class="md:w-full">
      <div class="mb-2">
        <h2 class="text-2xl md:text-base text-center font-bold">Expenses</h2>
      </div>
      <component
        :is="currentChart"
        :data="expensesByCategory"
        :options="chartOptions"
      />
    </div>
    <div class="md:w-full">
      <div class="mb-2">
        <h2 class="text-2xl md:text-base text-center font-bold">Income</h2>
      </div>
      <component
        :is="currentChart"
        :data="incomeByCategory"
        :options="chartOptions"
      />
    </div>
  </div>
</template>
