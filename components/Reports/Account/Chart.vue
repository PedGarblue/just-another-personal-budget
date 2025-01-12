<script lang="ts" setup>
import { Line } from 'vue-chartjs'
import type { PropType } from 'vue'
import { format } from 'date-fns'
import type { IReportAccountDisplayItem } from '~~/types/reportsTypes'

const props = defineProps({
  reports: {
    type: Array as PropType<IReportAccountDisplayItem[]>,
    required: true,
  },
})

// computed
const reportsChartData = computed(() => {
  const fromDateLabels = props.reports.map((report) => {
    // add utc offset to date
    const date = new Date(report.from_date)
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
    return format(new Date(date), 'MMM yy')
  })
  const balanceData: number[] = props.reports.map((report) =>
    Number(report.end_balance)
  )

  const expensesData: number[] = props.reports.map(
    (report) => Number(report.total_expenses) * -1
  )
  const incomeData: number[] = props.reports.map((report) =>
    Number(report.total_income)
  )

  return {
    labels: fromDateLabels,
    datasets: [
      {
        label: 'Total End Balance',
        data: balanceData,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Total Income',
        data: incomeData,
        backgroundColor: 'rgb(59, 166, 118)',
        borderColor: 'rgb(59, 166, 118)',
        tension: 0.1,
      },
      {
        label: 'Total Expense',
        data: expensesData,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  }
})

const chartOptions = ref({
  responsive: true,
})
</script>

<template>
  <div>
    <Line :data="reportsChartData" :options="chartOptions" />
  </div>
</template>
