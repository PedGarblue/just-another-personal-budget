<script lang="ts" setup>
import { ChevronDown, ListTree } from 'lucide-vue-next'
import type { ReceivableAPIItem, ReceivableGroup } from '@/api/receivables'
import type { ReceivableLinkedTransaction } from '@/types/receivablesTypes'
import { getReceivablesGroupedByContact } from '@/api/receivables'
import Modal from '@/components/Modal.vue'

const { t } = useLang()

const groups = ref<ReceivableGroup[]>([])
const expandedContactIds = ref<Set<number>>(new Set())
const ledgerModal = ref<InstanceType<typeof Modal> | null>(null)
const ledgerTitle = ref('')
const ledgerTransactions = ref<ReceivableLinkedTransaction[]>([])

function formatUsd(value: number | undefined | null) {
  const n = Number(value ?? 0)
  return `$${n.toFixed(2)}`
}

function toggleGroup(contactId: number) {
  const next = new Set(expandedContactIds.value)
  if (next.has(contactId)) {
    next.delete(contactId)
  } else {
    next.add(contactId)
  }
  expandedContactIds.value = next
}

function isExpanded(contactId: number) {
  return expandedContactIds.value.has(contactId)
}

const getReceivables = async () => {
  const data = await getReceivablesGroupedByContact()
  if (data) {
    groups.value = data
  }
}

const refreshTable = () => {
  getReceivables()
}

const openLedger = (row: ReceivableAPIItem) => {
  ledgerTitle.value =
    row.description?.trim() || row.contact_name?.trim() || `#${row.id}`
  ledgerTransactions.value = row.transactions ?? []
  ledgerModal.value?.open()
}

function formatLedgerUsd(usd: number | null) {
  if (usd === null || usd === undefined) return '—'
  return `$${Number(usd).toFixed(2)}`
}

function closeLedgerModal() {
  ledgerModal.value?.close()
}

onMounted(() => {
  getReceivables()
})
</script>

<template>
  <PageSection>
    <PageSectionTitle> Receivables </PageSectionTitle>
    <div class="flex flex-row w-full gap-4 mb-2">
      <ReceivablesCreate @form-finished="() => refreshTable()" />
    </div>

    <div
      v-if="groups.length === 0"
      class="py-8 text-center text-muted-foreground"
    >
      {{ t('pages.investments.receivables.grouped.empty') }}
    </div>

    <div v-else class="flex flex-col gap-3">
      <div
        v-for="group in groups"
        :key="group.contact_id"
        class="rounded-lg border border-border overflow-hidden"
      >
        <button
          type="button"
          class="flex w-full items-center justify-between gap-4 px-4 py-3 text-left hover:bg-muted/40 transition-colors"
          :aria-expanded="isExpanded(group.contact_id)"
          @click="toggleGroup(group.contact_id)"
        >
          <div class="min-w-0 flex-1">
            <p class="font-semibold truncate">{{ group.contact }}</p>
            <p class="text-sm text-muted-foreground mt-0.5">
              {{
                t('pages.investments.receivables.grouped.summary', {
                  count: group.receivables.length,
                  outstanding: formatUsd(group.total_outstanding_usd),
                })
              }}
            </p>
          </div>
          <div class="hidden sm:flex shrink-0 gap-6 text-sm">
            <div class="text-right">
              <p class="text-muted-foreground text-xs">
                {{ t('pages.investments.receivables.table.principal_usd') }}
              </p>
              <p class="font-medium">
                {{ formatUsd(group.total_principal_usd) }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-muted-foreground text-xs">
                {{ t('pages.investments.receivables.table.paid_usd') }}
              </p>
              <p class="font-medium">{{ formatUsd(group.total_paid_usd) }}</p>
            </div>
            <div class="text-right">
              <p class="text-muted-foreground text-xs">
                {{ t('pages.investments.receivables.table.outstanding_usd') }}
              </p>
              <p class="font-medium">
                {{ formatUsd(group.total_outstanding_usd) }}
              </p>
            </div>
          </div>
          <ChevronDown
            class="h-5 w-5 shrink-0 opacity-70 transition-transform duration-200"
            :class="{ 'rotate-180': isExpanded(group.contact_id) }"
            aria-hidden="true"
          />
        </button>

        <div
          v-show="isExpanded(group.contact_id)"
          class="border-t border-border overflow-x-auto"
        >
          <table class="w-full text-sm">
            <thead class="bg-muted/30">
              <tr>
                <th class="px-4 py-2 text-left font-medium">
                  {{ t('pages.investments.receivables.table.description') }}
                </th>
                <th class="px-4 py-2 text-left font-medium">
                  {{ t('pages.investments.receivables.table.due_date') }}
                </th>
                <th class="px-4 py-2 text-right font-medium">
                  {{ t('pages.investments.receivables.table.principal_usd') }}
                </th>
                <th class="px-4 py-2 text-right font-medium">
                  {{ t('pages.investments.receivables.table.paid_usd') }}
                </th>
                <th class="px-4 py-2 text-right font-medium">
                  {{ t('pages.investments.receivables.table.outstanding_usd') }}
                </th>
                <th class="px-4 py-2 text-left font-medium">
                  {{ t('pages.investments.receivables.table.status') }}
                </th>
                <th class="px-4 py-2 text-center font-medium">
                  {{ t('pages.investments.receivables.table.ledger') }}
                </th>
                <th class="px-4 py-2 text-center font-medium">
                  {{ t('pages.investments.receivables.table.operation') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="receivable in group.receivables"
                :key="receivable.id"
                class="border-t border-border/60"
              >
                <td class="px-4 py-2">{{ receivable.description || '—' }}</td>
                <td class="px-4 py-2 whitespace-nowrap">
                  {{ receivable.due_date }}
                </td>
                <td class="px-4 py-2 text-right">
                  {{ formatUsd(receivable.principal_usd) }}
                </td>
                <td class="px-4 py-2 text-right">
                  {{ formatUsd(receivable.paid_usd) }}
                </td>
                <td class="px-4 py-2 text-right">
                  {{ formatUsd(receivable.outstanding_usd) }}
                </td>
                <td class="px-4 py-2">{{ receivable.status }}</td>
                <td class="px-4 py-2 text-center">
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 text-sm underline-offset-2 hover:underline"
                    :aria-label="t('pages.investments.receivables.ledger.open')"
                    @click="openLedger(receivable)"
                  >
                    <ListTree class="h-4 w-4" />
                    {{ t('pages.investments.receivables.ledger.button') }}
                  </button>
                </td>
                <td class="px-4 py-2">
                  <div class="flex flex-row gap-1 justify-center">
                    <ReceivablesUpdate
                      :receivable="receivable"
                      @form-finished="() => refreshTable()"
                    />
                    <ReceivablesDelete
                      :receivable="receivable"
                      @form-finished="() => refreshTable()"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <Modal ref="ledgerModal">
      <template #contents>
        <Card
          class="modal-card m-auto my-4 max-h-[85vh] max-w-3xl overflow-hidden flex flex-col"
        >
          <CardTitle class="shrink-0 px-4 pt-4">
            <h3>{{ t('pages.investments.receivables.ledger.title') }}</h3>
            <p class="text-sm font-normal text-muted-foreground">
              {{ ledgerTitle }}
            </p>
          </CardTitle>
          <CardContent class="min-h-0 flex-1 overflow-auto px-4 pb-4">
            <table
              v-if="ledgerTransactions.length"
              class="w-full text-left text-sm"
            >
              <thead class="sticky top-0 bg-background border-b">
                <tr>
                  <th class="py-2 pr-2">
                    {{ t('pages.investments.receivables.ledger.col_date') }}
                  </th>
                  <th class="py-2 pr-2">
                    {{ t('pages.investments.receivables.ledger.col_amount') }}
                  </th>
                  <th class="py-2 pr-2">
                    {{ t('pages.investments.receivables.ledger.col_usd') }}
                  </th>
                  <th class="py-2">
                    {{
                      t('pages.investments.receivables.ledger.col_description')
                    }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="tx in ledgerTransactions"
                  :key="tx.id"
                  class="border-b border-border/60"
                >
                  <td class="py-2 pr-2 whitespace-nowrap">{{ tx.date }}</td>
                  <td class="py-2 pr-2">{{ tx.amount_display }}</td>
                  <td class="py-2 pr-2">
                    {{ formatLedgerUsd(tx.usd_amount) }}
                  </td>
                  <td class="py-2">{{ tx.description }}</td>
                </tr>
              </tbody>
            </table>
            <p v-else class="text-sm text-muted-foreground py-6">
              {{ t('pages.investments.receivables.ledger.empty') }}
            </p>
          </CardContent>
          <CardFooter class="shrink-0">
            <Button type="secondary" @click="closeLedgerModal">
              {{ t('pages.investments.receivables.ledger.close') }}
            </Button>
          </CardFooter>
        </Card>
      </template>
    </Modal>
  </PageSection>
</template>
