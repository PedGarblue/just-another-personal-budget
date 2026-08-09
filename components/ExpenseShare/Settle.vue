<script lang="ts" setup>
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { format } from 'date-fns'
import { formatUsd } from './formatUsd'
import ReceivablePeek from './ReceivablePeek.vue'
import PeriodSnapshot from './PeriodSnapshot.vue'
import { getExpenseSharePartnerList } from '~~/api/expenseSharePartners'
import {
  finalizeExpenseSharePeriod,
  getExpenseSharePeriodList,
  previewExpenseSharePeriod,
} from '~~/api/expenseSharePeriods'
import type {
  ExpenseSharePartner,
  ExpenseSharePeriod,
  ExpenseSharePreview,
} from '~~/types/expenseShareTypes'
import { toAPIError } from '~~/utils/apiError'
import { useNotificationsStore } from '~~/stores/notifications'

const { t } = useLang()
const notifications = useNotificationsStore()

const partners = ref<ExpenseSharePartner[]>([])
const selectedPartnerId = ref<number | ''>('')
const monthDate = ref<{ month: number; year: number }>({
  month: new Date().getMonth(),
  year: new Date().getFullYear(),
})
const partnerPercent = ref('')
const debouncedPercent = ref('')
const preview = ref<ExpenseSharePreview | null>(null)
const previewLoading = ref(false)
const previewError = ref('')
const dueDate = ref<Date | null>(null)
const notes = ref('')
const finalizeLoading = ref(false)
const finalizeError = ref('')
const finalizedPeriod = ref<ExpenseSharePeriod | null>(null)
const existingFinalized = ref<ExpenseSharePeriod | null>(null)
const receivablePeek = ref<InstanceType<typeof ReceivablePeek> | null>(null)

function resolveMonthDate(
  value: Date | { month: number; year: number } | null
): { year: number; month: number } {
  if (!value) {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() + 1 }
  }
  if (value instanceof Date) {
    return { year: value.getFullYear(), month: value.getMonth() + 1 }
  }
  // VueDatePicker month-picker uses 0-indexed month
  return { year: value.year, month: value.month + 1 }
}

const year = computed(() => resolveMonthDate(monthDate.value).year)
const month = computed(() => resolveMonthDate(monthDate.value).month)

const datePickerFormat = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

async function loadPartners() {
  partners.value = await getExpenseSharePartnerList({ is_active: true })
  if (
    selectedPartnerId.value !== '' &&
    !partners.value.some((p) => p.id === selectedPartnerId.value)
  ) {
    selectedPartnerId.value = ''
  }
}

watch(selectedPartnerId, (id) => {
  finalizedPeriod.value = null
  finalizeError.value = ''
  const partner = partners.value.find((p) => p.id === id)
  if (partner?.default_partner_percent) {
    partnerPercent.value = partner.default_partner_percent
    debouncedPercent.value = partner.default_partner_percent
  } else if (!partnerPercent.value) {
    partnerPercent.value = '50.00'
    debouncedPercent.value = '50.00'
  }
})

let percentTimer: ReturnType<typeof setTimeout> | null = null
watch(partnerPercent, (val) => {
  if (percentTimer) clearTimeout(percentTimer)
  percentTimer = setTimeout(() => {
    debouncedPercent.value = val
  }, 300)
})

async function checkExistingPeriod() {
  if (!selectedPartnerId.value) {
    existingFinalized.value = null
    return
  }
  try {
    const list = await getExpenseSharePeriodList({
      partner: Number(selectedPartnerId.value),
      year: year.value,
      month: month.value,
      status: 'finalized',
    })
    existingFinalized.value = list[0] ?? null
  } catch {
    existingFinalized.value = null
  }
}

async function loadPreview() {
  if (!selectedPartnerId.value) {
    preview.value = null
    previewError.value = ''
    return
  }
  previewLoading.value = true
  previewError.value = ''
  try {
    const params: {
      partner: number
      year: number
      month: number
      partner_percent?: string
    } = {
      partner: Number(selectedPartnerId.value),
      year: year.value,
      month: month.value,
    }
    if (debouncedPercent.value.trim()) {
      params.partner_percent = debouncedPercent.value.trim()
    }
    preview.value = await previewExpenseSharePeriod(params)
    if (preview.value?.partner_percent && !partnerPercent.value) {
      partnerPercent.value = preview.value.partner_percent
    }
    await checkExistingPeriod()
  } catch (e) {
    preview.value = null
    previewError.value = toAPIError(e).message
  } finally {
    previewLoading.value = false
  }
}

watch(
  [selectedPartnerId, year, month, debouncedPercent],
  () => {
    finalizedPeriod.value = null
    loadPreview()
  },
  { immediate: true }
)

async function onFinalize() {
  if (!selectedPartnerId.value) {
    finalizeError.value = t('pages.expenseShare.settle.partner_required')
    return
  }
  const percent = partnerPercent.value.trim()
  if (!percent) {
    finalizeError.value = t('pages.expenseShare.settle.percent_required')
    return
  }

  if (existingFinalized.value) {
    const ok = window.confirm(t('pages.expenseShare.settle.refinalize_confirm'))
    if (!ok) return
  }

  finalizeLoading.value = true
  finalizeError.value = ''
  try {
    const body: {
      partner: number
      year: number
      month: number
      partner_percent: string
      due_date?: string
      notes?: string
    } = {
      partner: Number(selectedPartnerId.value),
      year: year.value,
      month: month.value,
      partner_percent: percent,
    }
    if (dueDate.value instanceof Date) {
      body.due_date = format(dueDate.value, 'yyyy-MM-dd')
    } else if (typeof dueDate.value === 'string' && dueDate.value) {
      body.due_date = dueDate.value.slice(0, 10)
    }
    if (notes.value.trim()) {
      body.notes = notes.value.trim()
    }
    const result = await finalizeExpenseSharePeriod(body)
    finalizedPeriod.value = result
    existingFinalized.value = result
    notifications.addNotification({
      type: 'success',
      text: t('pages.expenseShare.settle.finalize_success'),
    })
    await loadPreview()
  } catch (e) {
    finalizeError.value = toAPIError(e).message
  } finally {
    finalizeLoading.value = false
  }
}

function viewReceivable(id: number) {
  receivablePeek.value?.open(id)
}

onMounted(() => {
  loadPartners()
})

defineExpose({ refreshPartners: loadPartners })
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap gap-4 items-end">
      <label class="flex flex-col gap-1 text-sm min-w-[12rem]">
        <span class="font-medium">
          {{ t('pages.expenseShare.settle.partner') }}
        </span>
        <select
          v-model="selectedPartnerId"
          class="rounded-md border border-border bg-background px-3 py-2"
        >
          <option :value="''">
            {{ t('pages.expenseShare.settle.partner_placeholder') }}
          </option>
          <option v-for="p in partners" :key="p.id" :value="p.id">
            {{ p.contact_name }}
          </option>
        </select>
      </label>

      <label class="flex flex-col gap-1 text-sm">
        <span class="font-medium">
          {{ t('pages.expenseShare.settle.month') }}
        </span>
        <VueDatePicker
          v-model="monthDate"
          month-picker
          :format="datePickerFormat"
          :enable-time-picker="false"
          auto-apply
          class="w-40"
        />
      </label>

      <label class="flex flex-col gap-1 text-sm w-32">
        <span class="font-medium">
          {{ t('pages.expenseShare.settle.partner_percent') }}
        </span>
        <input
          v-model="partnerPercent"
          type="number"
          min="0"
          max="100"
          step="0.01"
          class="rounded-md border border-border bg-background px-3 py-2"
        />
      </label>
    </div>

    <div v-if="previewError" class="text-sm text-red-500">
      {{ previewError }}
    </div>
    <div v-else-if="previewLoading" class="text-sm text-muted-foreground">
      {{ t('pages.expenseShare.common.loading') }}
    </div>
    <div v-else-if="preview" class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div class="rounded-lg border border-border p-3">
          <p class="text-xs text-muted-foreground">
            {{ t('pages.expenseShare.settle.total_expenses') }}
          </p>
          <p class="text-lg font-semibold">
            {{ formatUsd(preview.total_expenses_usd) }}
          </p>
        </div>
        <div class="rounded-lg border border-border p-3">
          <p class="text-xs text-muted-foreground">
            {{ t('pages.expenseShare.settle.partner_share') }}
          </p>
          <p class="text-lg font-semibold">
            {{ formatUsd(preview.partner_share_usd) }}
          </p>
        </div>
        <div class="rounded-lg border border-border p-3">
          <p class="text-xs text-muted-foreground">
            {{ t('pages.expenseShare.settle.my_share') }}
          </p>
          <p class="text-lg font-semibold">
            {{ formatUsd(preview.my_share_usd) }}
          </p>
        </div>
      </div>

      <PeriodSnapshot :lines="preview.lines" />

      <p
        v-if="existingFinalized"
        class="text-sm text-amber-600 dark:text-amber-400"
      >
        {{ t('pages.expenseShare.settle.already_finalized') }}
      </p>

      <div class="rounded-lg border border-border p-4 space-y-3">
        <h3 class="font-semibold text-sm">
          {{ t('pages.expenseShare.settle.finalize_title') }}
        </h3>
        <div v-if="finalizeError" class="text-sm text-red-500">
          {{ finalizeError }}
        </div>
        <div class="flex flex-wrap gap-4">
          <label class="flex flex-col gap-1 text-sm">
            <span class="font-medium">
              {{ t('pages.expenseShare.settle.due_date') }}
            </span>
            <VueDatePicker
              v-model="dueDate"
              :enable-time-picker="false"
              auto-apply
              class="w-44"
            />
          </label>
          <label class="flex flex-col gap-1 text-sm flex-1 min-w-[12rem]">
            <span class="font-medium">
              {{ t('pages.expenseShare.settle.notes') }}
            </span>
            <input
              v-model="notes"
              type="text"
              class="rounded-md border border-border bg-background px-3 py-2"
            />
          </label>
        </div>
        <Button
          size="sm"
          :disabled="finalizeLoading || !selectedPartnerId"
          @click="onFinalize"
        >
          {{
            finalizeLoading
              ? t('pages.expenseShare.common.saving')
              : existingFinalized
              ? t('pages.expenseShare.settle.refinalize')
              : t('pages.expenseShare.settle.finalize')
          }}
        </Button>
      </div>
    </div>
    <div v-else-if="selectedPartnerId" class="text-sm text-muted-foreground">
      {{ t('pages.expenseShare.settle.no_preview') }}
    </div>

    <div
      v-if="finalizedPeriod"
      class="rounded-lg border border-sky-500/40 bg-sky-500/5 p-4 space-y-3"
    >
      <h3 class="font-semibold">
        {{ t('pages.expenseShare.settle.result_title') }}
      </h3>
      <p class="text-sm">
        {{ finalizedPeriod.partner_contact_name }} —
        {{ finalizedPeriod.year }}-{{
          String(finalizedPeriod.month).padStart(2, '0')
        }}
        ({{ finalizedPeriod.status }})
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <div>
          {{ t('pages.expenseShare.settle.total_expenses') }}:
          {{ formatUsd(finalizedPeriod.total_expenses_usd) }}
        </div>
        <div>
          {{ t('pages.expenseShare.settle.partner_share') }}:
          {{ formatUsd(finalizedPeriod.partner_share_usd) }}
        </div>
        <div>
          {{ t('pages.expenseShare.settle.my_share') }}:
          {{ formatUsd(finalizedPeriod.my_share_usd) }}
        </div>
      </div>
      <PeriodSnapshot :lines="finalizedPeriod.lines" />
      <Button
        v-if="finalizedPeriod.receivable_id"
        size="sm"
        type="secondary"
        @click="viewReceivable(finalizedPeriod.receivable_id)"
      >
        {{ t('pages.expenseShare.receivable.view') }}
      </Button>
    </div>

    <ReceivablePeek ref="receivablePeek" />
  </div>
</template>
