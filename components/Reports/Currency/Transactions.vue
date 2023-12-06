<script lang="ts" setup>
import type { PropType } from 'vue'
import type { IReportCurrencyDisplayItem } from '~/types/reportsTypes'
import { useTransactions } from '~~/composables/useTransactions'

// props
const props = defineProps({
  report: {
    type: Object as PropType<IReportCurrencyDisplayItem>,
    required: true,
  },
})

const { transactionsAPIData, getTransactions } = useTransactions({
  getTransactionsParams: {
    from: props.report.from_date,
    to: props.report.to_date + 'T23:59:59Z',
    currency: props.report.currencyData.id,
    excludeSameCurrencyTransactions: true,
  },
})

// methods

const refreshTable = () => {
  getTransactions({
    from: props.report.from_date,
    to: parseDate(props.report.to_date),
  })
}

const parseDate = (date: string) => {
  return date + 'T23:59:59Z'
}

watch(
  () => props.report,
  () => {
    refreshTable()
  },
  { immediate: true }
)
</script>
<template>
  <div class="flex flex-col gap-4">
    <ReportsCurrencyChartCategories :transactions="transactionsAPIData" />
    <TransactionList
      :transactions="transactionsAPIData"
      :currency-criteria="props.report.currencyData.name"
    />
  </div>
</template>
