<script lang="ts" setup>
import type {
  FilterOption,
  Header,
  SortType,
  ClickRowArgument,
} from 'vue3-easy-data-table'
import type {
  IReportCurrencyApiItem,
  IReportCurrencyDisplayItem,
} from '~/types/reportsTypes'
import { getReportByCurrencyList } from '~~/api/reports/currency'
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
    text: 'Currency',
    value: 'currencyData.name',
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
const reports = ref<IReportCurrencyApiItem[]>([])
const selectedReport = ref<IReportCurrencyDisplayItem | null>(null)
const currencyCriteria = ref('')

const sortBy: string[] = ['from_date']
const sortType: SortType[] = ['desc']

// computed

const currencyNames = computed(() => accountsStore.getCurrenciesNames)

const displayReportsData = computed(() => {
  return (
    reports.value
      .map((report) => {
        const currencyData = accountsStore.getCurrency(report.currency)
        const newReport: IReportCurrencyDisplayItem = {
          ...report,
          currencyData,
          key: report.id,
        }
        return newReport
      })
      // filter by Currency
      .filter((report) => report.currencyData.name === currencyCriteria.value)
      // remove duplicated months
      .filter((report, index, self) => {
        return index === self.findIndex((t) => t.from_date === report.from_date)
      })
  )
})

const filterOptions = computed(() => {
  const filterOptionArray: FilterOption[] = []
  filterOptionArray.push({
    field: 'currencyData.name',
    comparison: '=',
    criteria: currencyCriteria.value,
  })

  return filterOptionArray
})

// methods

const getReports = async () => {
  const data = await getReportByCurrencyList()
  reports.value = data || []
}

const refreshTable = () => {
  getReports()
}

const setReportSelected = (item: ClickRowArgument) => {
  selectedReport.value = item as IReportCurrencyDisplayItem
}

// lifecycle

onMounted(() => {
  getReports()
})

// watch

// if accounts list set accountCriteria to first account
watch(currencyNames, () => {
  if (currencyNames.value.length > 0) {
    currencyCriteria.value = currencyNames.value[0]
  }
})
</script>

<template>
  <PageSection>
    <PageSectionTitle> Report By Account </PageSectionTitle>
    <div class="mb-4">
      <ReportsCurrencyChart :reports="displayReportsData" />
    </div>
    <div class="flex flex-row w-full gap-4 mb-2">
      <Select v-model="currencyCriteria" size="sm" :options="currencyNames" />
      <ReportsCurrencyCreate
        :currency="currencyCriteria"
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

        <!-- <template #item-operation="item">
          <ReportsUpdate :report="item" @form-finished="() => refreshTable()" />
        </template> -->
      </EasyDataTable>
    </div>
    <div v-if="selectedReport" class="mt-4">
      <ReportsCurrencyTransactions :report="selectedReport" />
    </div>
  </PageSection>
</template>
