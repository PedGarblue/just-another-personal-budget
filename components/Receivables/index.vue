<script lang="ts" setup>
import type { Header } from 'vue3-easy-data-table'
import type { ReceivableAPIItem } from '~/api/receivables'
import { getReceivableList } from '~/api/receivables'

const receivables = ref<ReceivableAPIItem[]>([])
const headers: Header[] = [
  {
    text: 'description',
    value: 'description',
  },
  {
    text: 'amount Given',
    value: 'amount_given',
  },
  {
    text: 'amount to receive',
    value: 'amount_to_receive',
  },
  {
    text: 'amount paid',
    value: 'amount_paid',
  },
  {
    text: 'status',
    value: 'status',
  },
  {
    text: 'contact',
    value: 'contact',
  },
  {
    text: 'due date',
    value: 'due_date',
  },
  {
    text: 'operation',
    value: 'operation',
  },
]

const getReceivables = async () => {
  const data = await getReceivableList()
  if (data) {
    receivables.value = data.results || []
  }
}

const refreshTable = () => {
  getReceivables()
  // should i be doing this?
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
  </PageSection>
</template>
