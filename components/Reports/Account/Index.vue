<script lang="ts" setup>
import type {
  FilterOption,
  Header,
  SortType,
  ClickRowArgument,
} from 'vue3-easy-data-table'
import type {
  IReportAccountApiItem,
  IReportAccountDisplayItem,
} from '~/types/reportsTypes'
import { getReportAccountList } from '~~/api/reports'
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
const reports = ref<IReportAccountApiItem[]>([])
const selectedReport = ref<IReportAccountDisplayItem | null>(null)
const accountCriteria = ref('')
const numberOfReports = ref(12)
const numberOfReportsOptions = [
  { text: '1 Year', value: 12 },
  { text: '2 Years', value: 24 },
  { text: '3 Years', value: 36 },
  { text: '4 Years', value: 48 },
]

const sortBy: string[] = ['from_date']
const sortType: SortType[] = ['desc']

// computed

const displayReportsData = computed(() => {
  return (
    reports.value
      .map((report) => {
        const account = accountsStore.getAccount(report.account)
        const newReport: IReportAccountDisplayItem = {
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
        return index === self.findIndex((t) => t.from_date === report.from_date)
      })
      .slice(0, numberOfReports.value)
  )
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
  const data = await getReportAccountList()
  reports.value = data || []
}

const refreshTable = () => {
  getReports()
}

const setReportSelected = (item: ClickRowArgument) => {
  selectedReport.value = item as IReportAccountDisplayItem
}

// lifecycle

onMounted(() => {
  getReports()
})

// watch

// if accounts list set accountCriteria to first account
watch(accountsNames, () => {
  if (accountsNames.value.length > 0) {
    accountCriteria.value = accountsNames.value[0]
  }
})
</script>

<template>
  <PageSection>
    <PageSectionTitle> Report By Account </PageSectionTitle>
    <div class="mb-4">
      <div class="mb-2">
        <Button
          v-for="option in numberOfReportsOptions"
          :key="option.value"
          type="secondary"
          size="sm"
          class="inline mx-2"
          @click="numberOfReports = option.value"
        >
          {{ option.text }}
        </Button>
      </div>
      <ReportsAccountChart :reports="displayReportsData" />
    </div>
    <div class="flex flex-row w-full gap-4 mb-2">
      <Select v-model="accountCriteria" size="sm" :options="accountsNames" />
      <ReportsAccountCreate
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
          <ReportsAccountUpdate
            :report="item"
            @form-finished="() => refreshTable()"
          />
        </template>
      </EasyDataTable>
    </div>
    <div v-if="selectedReport" class="mt-4">
      <ReportsAccountTransactions :report="selectedReport" />
    </div>
  </PageSection>
</template>
