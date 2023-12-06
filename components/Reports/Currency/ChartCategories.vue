<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import { PropType } from 'vue'
import { TransactionAPI } from '~~/api/transactions'
import { useTransactions } from '~~/stores/transactions'

type CategoryGroupItem = {
  [key: string]: {
    amount: number
    color: string
  }
}

const props = defineProps({
  transactions: {
    type: Array as PropType<TransactionAPI[]>,
    required: true,
  },
})

const transactionsStore = useTransactions()

const chartOptions = ref({
  responsive: true,
})

const groupByCategory = (transactions: TransactionAPI[]) => {
  const grouped = transactions.reduce(
    (acc, transaction) => {
      const amount = Number(transaction.amount)
      const category = transactionsStore.getCategory(transaction.category)
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
    props.transactions.filter((transaction) => Number(transaction.amount) < 0)
  )
})

const incomeByCategory = computed(() => {
  return toChartData(
    props.transactions.filter((transaction) => Number(transaction.amount) > 0)
  )
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
