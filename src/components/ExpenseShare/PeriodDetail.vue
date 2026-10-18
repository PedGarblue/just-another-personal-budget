<script lang="ts" setup>
import { formatUsd } from './formatUsd'
import PeriodSnapshot from './PeriodSnapshot.vue'
import ReceivablePeek from './ReceivablePeek.vue'
import type { ExpenseSharePeriod } from '@/types/expenseShareTypes'
import Modal from '@/components/Modal.vue'

const { t } = useLang()
const modal = ref<InstanceType<typeof Modal> | null>(null)
const receivablePeek = ref<InstanceType<typeof ReceivablePeek> | null>(null)
const period = ref<ExpenseSharePeriod | null>(null)

function open(p: ExpenseSharePeriod) {
  period.value = p
  modal.value?.open()
}

function close() {
  modal.value?.close()
}

function viewReceivable() {
  if (period.value?.receivable_id) {
    receivablePeek.value?.open(period.value.receivable_id)
  }
}

defineExpose({ open, close })
</script>

<template>
  <div>
    <Modal ref="modal">
      <template #header>
        {{ t('pages.expenseShare.history.detail_title') }}
      </template>
      <template #body>
        <div v-if="period" class="space-y-4 text-sm">
          <div class="grid grid-cols-2 gap-2">
            <p>
              <span class="text-muted-foreground">
                {{ t('pages.expenseShare.history.partner') }}:
              </span>
              {{ period.partner_contact_name }}
            </p>
            <p>
              <span class="text-muted-foreground">
                {{ t('pages.expenseShare.history.period') }}:
              </span>
              {{ period.year }}-{{ String(period.month).padStart(2, '0') }}
            </p>
            <p>
              <span class="text-muted-foreground">
                {{ t('pages.expenseShare.history.status') }}:
              </span>
              {{ period.status }}
            </p>
            <p>
              <span class="text-muted-foreground">
                {{ t('pages.expenseShare.settle.partner_percent') }}:
              </span>
              {{ period.partner_percent }}%
            </p>
            <p>
              <span class="text-muted-foreground">
                {{ t('pages.expenseShare.settle.total_expenses') }}:
              </span>
              {{ formatUsd(period.total_expenses_usd) }}
            </p>
            <p>
              <span class="text-muted-foreground">
                {{ t('pages.expenseShare.settle.partner_share') }}:
              </span>
              {{ formatUsd(period.partner_share_usd) }}
            </p>
            <p>
              <span class="text-muted-foreground">
                {{ t('pages.expenseShare.settle.my_share') }}:
              </span>
              {{ formatUsd(period.my_share_usd) }}
            </p>
            <p v-if="period.finalized_at">
              <span class="text-muted-foreground">
                {{ t('pages.expenseShare.history.finalized_at') }}:
              </span>
              {{ period.finalized_at }}
            </p>
          </div>
          <p v-if="period.notes">
            <span class="text-muted-foreground">
              {{ t('pages.expenseShare.settle.notes') }}:
            </span>
            {{ period.notes }}
          </p>
          <PeriodSnapshot :lines="period.lines" />
        </div>
      </template>
      <template #footer>
        <div class="flex gap-2 justify-end w-full">
          <Button
            v-if="period?.receivable_id"
            size="sm"
            type="secondary"
            @click="viewReceivable"
          >
            {{ t('pages.expenseShare.receivable.view') }}
          </Button>
          <Button size="sm" @click="close">
            {{ t('pages.expenseShare.common.close') }}
          </Button>
        </div>
      </template>
    </Modal>
    <ReceivablePeek ref="receivablePeek" />
  </div>
</template>
