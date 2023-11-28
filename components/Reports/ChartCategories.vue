<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import { PropType } from 'vue'
import { TransactionAPI } from '~~/api/transactions'
import { useTransactions } from '~~/stores/transactions'

const transactionsStore = useTransactions()

const props = defineProps({
  transactions: {
    type: Array as PropType<TransactionAPI[]>,
    required: true,
  },
})

const groupByCategory = (transactions: TransactionAPI[]) => {
  const grouped = transactions.reduce(
    (acc, transaction) => {
      const amount = Number(transaction.amount)
      const category = transactionsStore.getCategory(transaction.category)
      if (!category) {
        acc['No Category'] += amount
        return acc
      }
      if (!acc[category.name]) {
        acc[category.name] = 0
      }
      acc[category.name] += amount
      return acc
    },
    { 'No Category': 0 } as Record<string, number>
  )
  const groupedSorted = Object.fromEntries(
    Object.entries(grouped).sort(([, a], [, b]) => b - a)
  )
  return groupedSorted
}

const groupExpensesByCategory = (transactions: TransactionAPI[]) => {
  const categories = groupByCategory(
    transactions.filter((transaction) => Number(transaction.amount) < 0)
  )
  return categories
}

const groupIncomeByCategory = (transactions: TransactionAPI[]) => {
  const categories = groupByCategory(
    transactions.filter((transaction) => Number(transaction.amount) > 0)
  )
  return categories
}

const categories = computed(() => {
  return transactionsStore.getCategories
})

const expensesByCategory = computed(() => {
  const group = groupExpensesByCategory(props.transactions)
  const labels = Object.keys(group)
  const categoryColors = categories.value
    .filter((category) => labels.includes(category.name))
    .map((category) => category.color)
  const datasets = [
    {
      data: Object.values(group),
      backgroundColor: [...categoryColors, '#fafafa'],
      borderColor: ['#a0a0a0'],
    },
  ]
  return { labels, datasets }
})

const incomeByCategory = computed(() => {
  const group = groupIncomeByCategory(props.transactions)
  const labels = Object.keys(group)
  const categoryColors = categories.value
    .filter((category) => labels.includes(category.name))
    .map((category) => category.color)
  const datasets = [
    {
      data: Object.values(group),
      backgroundColor: ['#fafafa', ...categoryColors],
      borderColor: ['#a0a0a0'],
    },
  ]
  return { labels, datasets }
})

const chartOptions = ref({
  responsive: true,
})
</script>

<template>
  <div class="flex max-w-full justify-center gap-4">
    <div class="w-full">
      <div>
        <h2 class="text-center font-bold">Expenses</h2>
      </div>
      <Doughnut :data="expensesByCategory" :options="chartOptions" />
    </div>
    <div class="w-full">
      <div>
        <h2 class="text-center font-bold">Income</h2>
      </div>
      <Doughnut :data="incomeByCategory" :options="chartOptions" />
    </div>
  </div>
</template>
