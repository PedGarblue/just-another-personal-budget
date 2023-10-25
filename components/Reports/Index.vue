<script lang="ts" setup>
import type {
  FilterOption,
  Header,
  ClickRowArgument,
} from 'vue3-easy-data-table'
import type { IReportApiItem, IReportDisplayItem } from '~/types/reportsTypes'
import { getReportList } from '~~/api/reports'
import { useAccounts } from '~~/stores/accounts'

const accountsStore = useAccounts()

// data
const headers: Header[] = [
  {
    text: 'From Date',
    value: 'from_date',
  },
  {
    text: 'To Date',
    value: 'to_date',
  },
  {
    text: 'Account',
    value: 'accountData.name',
  },
  {
    text: 'Initial Balance',
    value: 'initial_balance',
  },
  {
    text: 'End Balance',
    value: 'end_balance',
  },
  {
    text: 'Total Income',
    value: 'total_income',
  },
  {
    text: 'Total Expenses',
    value: 'total_expenses',
  },
]
const reports = ref<IReportApiItem[]>([])
const accountCriteria = ref(accountsStore.getAccountsNames[0])
const selectedReport = ref<IReportDisplayItem | null>(null)

// computed

const displayReportsData = computed(() => {
  return reports.value
    ? reports.value.map((report) => {
        const account = accountsStore.getAccount(report.account)
        const newReport: IReportDisplayItem = {
          ...report,
          accountData: account,
          key: report.id,
        }
        return newReport
      })
    : []
})

const filterOptions = computed(() => {
  const filterOptionArray: FilterOption[] = []
  filterOptionArray.push({
    field: 'accountData.name',
    comparison: '=',
    criteria: accountCriteria.value,
  })

  return filterOptionArray
})

const accountsNames = computed(() => accountsStore.getAccountsNames)

// methods

const getReports = async () => {
  const data = await getReportList()
  reports.value = data || []
}

const refreshTable = () => {
  getReports()
}

const setReportSelected = (item: ClickRowArgument) => {
  selectedReport.value = item as IReportDisplayItem
}

// lifecycle

onMounted(() => {
  getReports()
})
</script>

<template>
  <PageSection>
    <PageSectionTitle> Reports </PageSectionTitle>
    <div class="flex flex-row w-full gap-4 mb-2">
      <Select
        v-model="accountCriteria"
        size="sm"
        :default="accountsNames[0]"
        :options="accountsNames"
      />
      <ReportsCreate @refresh-table="refreshTable" />
    </div>
    <div>
      <EasyDataTable
        :headers="headers"
        :items="displayReportsData"
        :filter-options="filterOptions"
        @click-row="setReportSelected"
      ></EasyDataTable>
    </div>
    <div v-if="selectedReport" class="mt-4">
      <ReportsTransactions :report="selectedReport" />
    </div>
  </PageSection>
</template>
