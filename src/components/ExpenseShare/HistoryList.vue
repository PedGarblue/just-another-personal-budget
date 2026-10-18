<script lang="ts" setup>
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { formatUsd } from './formatUsd'
import PeriodDetail from './PeriodDetail.vue'
import { getExpenseSharePartnerList } from '@/api/expenseSharePartners'
import { getExpenseSharePeriodList } from '@/api/expenseSharePeriods'
import type {
  ExpenseSharePartner,
  ExpenseSharePeriod,
  ExpenseSharePeriodStatus,
} from '@/types/expenseShareTypes'
import { toAPIError } from '@/utils/apiError'

const { t } = useLang()

const partners = ref<ExpenseSharePartner[]>([])
const periods = ref<ExpenseSharePeriod[]>([])
const loading = ref(false)
const errorMessage = ref('')
const filterPartnerId = ref<number | ''>('')
const filterMonth = ref<Date | { month: number; year: number } | null>(null)
const filterStatus = ref<ExpenseSharePeriodStatus | ''>('')
const detailRef = ref<InstanceType<typeof PeriodDetail> | null>(null)

const datePickerFormat = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function resolveMonthDate(
  value: Date | { month: number; year: number } | null
): { year: number; month: number } | null {
  if (!value) return null
  if (value instanceof Date) {
    return { year: value.getFullYear(), month: value.getMonth() + 1 }
  }
  return { year: value.year, month: value.month + 1 }
}

async function loadPartners() {
  partners.value = await getExpenseSharePartnerList()
}

async function loadPeriods() {
  loading.value = true
  errorMessage.value = ''
  try {
    const params: {
      year?: number
      month?: number
      partner?: number
      status?: ExpenseSharePeriodStatus
    } = {}
    const resolved = resolveMonthDate(filterMonth.value)
    if (resolved) {
      params.year = resolved.year
      params.month = resolved.month
    }
    if (filterPartnerId.value) {
      params.partner = Number(filterPartnerId.value)
    }
    if (filterStatus.value) {
      params.status = filterStatus.value
    }
    periods.value = await getExpenseSharePeriodList(params)
  } catch (e) {
    errorMessage.value = toAPIError(e).message
  } finally {
    loading.value = false
  }
}

function openDetail(period: ExpenseSharePeriod) {
  nextTick(() => detailRef.value?.open(period))
}

watch([filterPartnerId, filterMonth, filterStatus], () => {
  loadPeriods()
})

onMounted(async () => {
  await loadPartners()
  await loadPeriods()
})

defineExpose({ refresh: loadPeriods })
</script>

<template>
  <div>
    <div class="flex flex-wrap gap-4 items-end mb-4">
      <label class="flex flex-col gap-1 text-sm min-w-[10rem]">
        <span class="font-medium">
          {{ t('pages.expenseShare.history.partner') }}
        </span>
        <select
          v-model="filterPartnerId"
          class="rounded-md border border-border bg-background px-3 py-2"
        >
          <option :value="''">
            {{ t('pages.expenseShare.history.all_partners') }}
          </option>
          <option v-for="p in partners" :key="p.id" :value="p.id">
            {{ p.contact_name }}
          </option>
        </select>
      </label>

      <label class="flex flex-col gap-1 text-sm">
        <span class="font-medium">
          {{ t('pages.expenseShare.history.month') }}
        </span>
        <VueDatePicker
          v-model="filterMonth"
          month-picker
          :format="datePickerFormat"
          :enable-time-picker="false"
          auto-apply
          :clearable="true"
          class="w-40"
        />
      </label>

      <label class="flex flex-col gap-1 text-sm">
        <span class="font-medium">
          {{ t('pages.expenseShare.history.status') }}
        </span>
        <select
          v-model="filterStatus"
          class="rounded-md border border-border bg-background px-3 py-2"
        >
          <option value="">
            {{ t('pages.expenseShare.history.all_statuses') }}
          </option>
          <option value="draft">draft</option>
          <option value="finalized">finalized</option>
        </select>
      </label>

      <Button size="sm" type="secondary" @click="loadPeriods">
        {{ t('pages.expenseShare.common.refresh') }}
      </Button>
    </div>

    <div v-if="errorMessage" class="mb-3 text-sm text-red-500">
      {{ errorMessage }}
    </div>
    <div v-if="loading" class="py-6 text-sm text-muted-foreground">
      {{ t('pages.expenseShare.common.loading') }}
    </div>
    <div
      v-else-if="periods.length === 0"
      class="py-8 text-center text-muted-foreground"
    >
      {{ t('pages.expenseShare.history.empty') }}
    </div>
    <div v-else class="overflow-x-auto rounded-lg border border-border">
      <table class="w-full text-sm">
        <thead class="bg-muted/40 text-left">
          <tr>
            <th class="px-3 py-2 font-medium">
              {{ t('pages.expenseShare.history.partner') }}
            </th>
            <th class="px-3 py-2 font-medium">
              {{ t('pages.expenseShare.history.period') }}
            </th>
            <th class="px-3 py-2 font-medium">
              {{ t('pages.expenseShare.history.status') }}
            </th>
            <th class="px-3 py-2 font-medium text-right">
              {{ t('pages.expenseShare.settle.partner_share') }}
            </th>
            <th class="px-3 py-2 font-medium">
              {{ t('pages.expenseShare.history.actions') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="period in periods"
            :key="period.id"
            class="border-t border-border"
          >
            <td class="px-3 py-2">{{ period.partner_contact_name }}</td>
            <td class="px-3 py-2">
              {{ period.year }}-{{ String(period.month).padStart(2, '0') }}
            </td>
            <td class="px-3 py-2">{{ period.status }}</td>
            <td class="px-3 py-2 text-right">
              {{ formatUsd(period.partner_share_usd) }}
            </td>
            <td class="px-3 py-2">
              <button
                type="button"
                class="text-sky-500 hover:underline"
                @click="openDetail(period)"
              >
                {{ t('pages.expenseShare.history.view') }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <PeriodDetail ref="detailRef" />
  </div>
</template>
