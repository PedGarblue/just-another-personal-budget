<script lang="ts" setup>
import type { PropType } from 'vue'
import type { IReportDisplayItem } from '~/types/reportsTypes'
import { useTransactions } from '~~/composables/useTransactions'

// props
const props = defineProps({
  report: {
    type: Object as PropType<IReportDisplayItem>,
    required: true,
  },
})

const { transactionsAPIData, getTransactions } = useTransactions({
  getTransactionsParams: {
    account: props.report.account,
    from: props.report.from_date,
    to: props.report.to_date + 'T23:59:59Z',
  },
})

// methods

const refreshTable = () => {
  getTransactions({
    account: props.report.account,
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
  <TransactionList
    :transactions="transactionsAPIData"
    :account-criteria="props.report.accountData.name"
  />
</template>
