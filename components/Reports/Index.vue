<script lang="ts" setup>
import type {
  FilterOption,
  Header,
  SortType,
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
  {
    text: 'Operation',
    value: 'operation',
  },
]
const reports = ref<IReportApiItem[]>([])
const accountCriteria = ref(accountsStore.getAccountsNames[0])
const selectedReport = ref<IReportDisplayItem | null>(null)

const sortBy: string[] = ['from_date']
const sortType: SortType[] = ['desc']

// computed

const displayReportsData = computed(() => {
  return reports.value
    ? reports.value
        .map((report) => {
          const account = accountsStore.getAccount(report.account)
          const newReport: IReportDisplayItem = {
            ...report,
            accountData: account,
            key: report.id,
          }
          return newReport
        })
        // filter by account
        .filter((report) => report.accountData.name === accountCriteria.value)
        // remove duplicated months
        .filter((report, index, self) => {
          return (
            index === self.findIndex((t) => t.from_date === report.from_date)
          )
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
    <PageSectionTitle> Report By Account </PageSectionTitle>
    <div class="mb-4">
      <ReportsChart :reports="displayReportsData" />
    </div>
    <div class="flex flex-row w-full gap-4 mb-2">
      <Select
        v-model="accountCriteria"
        size="sm"
        :default="accountsNames[0]"
        :options="accountsNames"
      />
      <ReportsCreate
        :account="accountCriteria"
        @form-finished="() => refreshTable()"
      />
    </div>
    <div>
      <EasyDataTable
        :headers="headers"
        :items="displayReportsData"
        :sort-by="sortBy"
        :sort-type="sortType"
        :filter-options="filterOptions"
        @click-row="setReportSelected"
      >
        <template #item-initial_balance="item">
          <span class="font-bold">
            {{ item.initial_balance }}
          </span>
        </template>

        <template #item-end_balance="item">
          <span
            class="font-bold"
            :class="{
              'text-green-500': item.balance_status === 'positive',
              'text-red-500': item.balance_status === 'negative',
            }"
          >
            {{ item.end_balance }}
          </span>
        </template>

        <template #item-total_income="item">
          <span class="font-bold text-green-500">
            {{ item.total_income }}
          </span>
        </template>

        <template #item-total_expenses="item">
          <span class="font-bold text-red-500">
            {{ item.total_expenses }}
          </span>
        </template>

        <template #item-operation="item">
          <ReportsUpdate :report="item" @form-finished="() => refreshTable()" />
        </template>
      </EasyDataTable>
    </div>
    <div v-if="selectedReport" class="mt-4">
      <ReportsTransactions :report="selectedReport" />
    </div>
  </PageSection>
</template>
