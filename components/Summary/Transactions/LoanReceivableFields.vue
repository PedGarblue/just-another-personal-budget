<script lang="ts" setup>
import VueDatePicker from '@vuepic/vue-datepicker'
import { ChevronDown } from 'lucide-vue-next'
import type { ReceivableAPIItem } from '~~/api/receivables'

const props = defineProps<{
  receivableRows: ReceivableAPIItem[]
  receivableOptionLabel: (r: ReceivableAPIItem) => string
  collectionSelectId: string
}>()

const advancedOpen = defineModel<boolean>('advancedOpen', { required: true })
const isLoan = defineModel<boolean>('isLoan', { required: true })
const loanContact = defineModel<string>('loanContact', { required: true })
const loanDueDate = defineModel<Date | null>('loanDueDate', { required: true })
const collectionReceivableId = defineModel<number>('collectionReceivableId', {
  required: true,
})

const { t } = useLang()
</script>

<template>
  <div class="mt-6 border-t border-border pt-4">
    <button
      type="button"
      class="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-700/40 px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-gray-100/80 dark:border-gray-600/60 dark:hover:bg-gray-800/80"
      :aria-expanded="advancedOpen"
      @click="advancedOpen = !advancedOpen"
    >
      <span>{{
        advancedOpen
          ? t('transactions.loan.advanced_hide')
          : t('transactions.loan.advanced_show')
      }}</span>
      <ChevronDown
        class="h-4 w-4 shrink-0 opacity-70 transition-transform duration-200"
        :class="{ 'rotate-180': advancedOpen }"
        aria-hidden="true"
      />
    </button>

    <div v-show="advancedOpen" class="mt-4 space-y-4">
      <div class="flex flex-col gap-2">
        <label class="flex cursor-pointer items-center gap-2 text-sm">
          <input v-model="isLoan" type="checkbox" class="rounded" />
          {{ t('transactions.loan.checkbox_label') }}
        </label>
        <p class="text-xs text-muted-foreground">
          {{ t('transactions.loan.loan_help') }}
        </p>
      </div>
      <template v-if="isLoan">
        <FormInput
          v-model="loanContact"
          :title="t('transactions.loan.contact_title')"
          required
          size="md"
        />
        <div class="flex flex-col gap-1">
          <span class="text-base">{{
            t('transactions.loan.due_date_title')
          }}</span>
          <VueDatePicker
            v-model="loanDueDate"
            text-input
            dark
            :placeholder="t('transactions.loan.due_date_placeholder')"
          />
        </div>
      </template>

      <div v-if="!isLoan" class="flex flex-col gap-2">
        <label class="text-base" :for="collectionSelectId">
          {{ t('transactions.loan.collection_select_title') }}
        </label>
        <select
          :id="collectionSelectId"
          v-model.number="collectionReceivableId"
          class="rounded-full border border-gray-700 bg-transparent px-4 py-2 text-base dark:border-gray-600"
        >
          <option :value="0">
            {{ t('transactions.loan.no_receivable') }}
          </option>
          <option v-for="r in props.receivableRows" :key="r.id" :value="r.id">
            {{ receivableOptionLabel(r) }}
          </option>
        </select>
        <p class="text-xs text-muted-foreground">
          {{ t('transactions.loan.collection_help') }}
        </p>
      </div>
    </div>
  </div>
</template>
