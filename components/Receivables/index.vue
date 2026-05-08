<script lang="ts" setup>
import { ListTree } from 'lucide-vue-next'
import type { Header } from 'vue3-easy-data-table'
import type { ReceivableAPIItem } from '~/api/receivables'
import type { ReceivableLinkedTransaction } from '~/types/receivablesTypes'
import { getReceivableList } from '~/api/receivables'
import Modal from '~/components/Modal.vue'

const { t } = useLang()

const receivables = ref<ReceivableAPIItem[]>([])
const ledgerModal = ref<InstanceType<typeof Modal> | null>(null)
const ledgerTitle = ref('')
const ledgerTransactions = ref<ReceivableLinkedTransaction[]>([])

function formatUsd(value: number | undefined | null) {
  const n = Number(value ?? 0)
  return `$${n.toFixed(2)}`
}

const headers = computed<Header[]>(() => [
  {
    text: t('pages.investments.receivables.table.description'),
    value: 'description',
  },
  { text: t('pages.investments.receivables.table.contact'), value: 'contact' },
  {
    text: t('pages.investments.receivables.table.due_date'),
    value: 'due_date',
  },
  {
    text: t('pages.investments.receivables.table.principal_usd'),
    value: 'principal_usd',
  },
  {
    text: t('pages.investments.receivables.table.paid_usd'),
    value: 'paid_usd',
  },
  {
    text: t('pages.investments.receivables.table.outstanding_usd'),
    value: 'outstanding_usd',
  },
  { text: t('pages.investments.receivables.table.status'), value: 'status' },
  { text: t('pages.investments.receivables.table.ledger'), value: 'ledger' },
  {
    text: t('pages.investments.receivables.table.operation'),
    value: 'operation',
  },
])

const getReceivables = async () => {
  const data = await getReceivableList({ page_size: 500 })
  if (data) {
    receivables.value = data.results || []
  }
}

const refreshTable = () => {
  getReceivables()
}

const openLedger = (row: ReceivableAPIItem) => {
  ledgerTitle.value = row.description?.trim() || `#${row.id}`
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
    <EasyDataTable :headers="headers" :items="receivables">
      <template #item-principal_usd="item">
        {{ formatUsd(item.principal_usd) }}
      </template>
      <template #item-paid_usd="item">
        {{ formatUsd(item.paid_usd) }}
      </template>
      <template #item-outstanding_usd="item">
        {{ formatUsd(item.outstanding_usd) }}
      </template>
      <template #item-ledger="item">
        <button
          type="button"
          class="inline-flex items-center gap-1 text-sm underline-offset-2 hover:underline"
          :aria-label="t('pages.investments.receivables.ledger.open')"
          @click="openLedger(item)"
        >
          <ListTree class="h-4 w-4" />
          {{ t('pages.investments.receivables.ledger.button') }}
        </button>
      </template>
      <template #item-operation="receivable">
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
      </template>
    </EasyDataTable>

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
