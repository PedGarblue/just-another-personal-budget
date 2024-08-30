<script lang="ts" setup>
import type { PropType } from 'vue'
import type { IReportAccountDisplayItem } from '~/types/reportsTypes'
import type { TransactionAPI } from '~~/api/transactions'
import TransactionList from '~~/components/Transaction/List.vue'

// props
const props = defineProps({
  report: {
    type: Object as PropType<IReportAccountDisplayItem>,
    required: true,
  },
})
const transactionList = ref<InstanceType<typeof TransactionList> | null>(null)

// methods
const transactions = computed<TransactionAPI[]>(() => {
  return transactionList.value?.transactionsRaw ?? []
})

watch(
  () => props.report,
  () => {
    transactionList.value?.refreshTable()
  },
  { immediate: true }
)
</script>
<template>
  <div class="flex flex-col gap-4">
    <ReportsAccountChartCategories :transactions="transactions" />
    <TransactionList
      ref="transactionList"
      :from-date="report.from_date"
      :to-date="report.to_date"
      :account-criteria="props.report.accountData.id"
    />
  </div>
</template>
