<script lang="ts" setup>
import { formatUsd } from './formatUsd'
import type { ReceivableAPIItem } from '@/types/receivablesTypes'
import { fetchAPIAuth } from '@/composables/useAPIAuth'
import Modal from '@/components/Modal.vue'

const { t } = useLang()
const modal = ref<InstanceType<typeof Modal> | null>(null)
const loading = ref(false)
const errorMessage = ref('')
const receivable = ref<ReceivableAPIItem | null>(null)

async function open(receivableId: number) {
  loading.value = true
  errorMessage.value = ''
  receivable.value = null
  modal.value?.open()
  try {
    receivable.value = await fetchAPIAuth<ReceivableAPIItem>(
      `/receivables/${receivableId}/`
    )
    if (!receivable.value) {
      errorMessage.value = t('pages.expenseShare.receivable.not_found')
    }
  } catch (e) {
    errorMessage.value =
      e instanceof Error
        ? e.message
        : t('pages.expenseShare.receivable.load_error')
  } finally {
    loading.value = false
  }
}

function close() {
  modal.value?.close()
}

defineExpose({ open, close })
</script>

<template>
  <Modal ref="modal">
    <template #header>
      {{ t('pages.expenseShare.receivable.title') }}
      <span v-if="receivable" class="text-muted-foreground font-normal">
        #{{ receivable.id }}
      </span>
    </template>
    <template #body>
      <div v-if="loading" class="py-4 text-sm text-muted-foreground">
        {{ t('pages.expenseShare.common.loading') }}
      </div>
      <div v-else-if="errorMessage" class="py-2 text-sm text-red-500">
        {{ errorMessage }}
      </div>
      <div v-else-if="receivable" class="space-y-2 text-sm">
        <p>
          <span class="text-muted-foreground">
            {{ t('pages.expenseShare.receivable.contact') }}:
          </span>
          {{ receivable.contact_name }}
        </p>
        <p v-if="receivable.description">
          <span class="text-muted-foreground">
            {{ t('pages.expenseShare.receivable.description') }}:
          </span>
          {{ receivable.description }}
        </p>
        <p>
          <span class="text-muted-foreground">
            {{ t('pages.expenseShare.receivable.principal') }}:
          </span>
          {{ formatUsd(receivable.principal_usd) }}
        </p>
        <p v-if="receivable.explicit_principal_usd != null">
          <span class="text-muted-foreground">
            {{ t('pages.expenseShare.receivable.explicit_principal') }}:
          </span>
          {{ formatUsd(receivable.explicit_principal_usd) }}
        </p>
        <p>
          <span class="text-muted-foreground">
            {{ t('pages.expenseShare.receivable.paid') }}:
          </span>
          {{ formatUsd(receivable.paid_usd) }}
        </p>
        <p>
          <span class="text-muted-foreground">
            {{ t('pages.expenseShare.receivable.outstanding') }}:
          </span>
          {{ formatUsd(receivable.outstanding_usd) }}
        </p>
        <p>
          <span class="text-muted-foreground">
            {{ t('pages.expenseShare.receivable.status') }}:
          </span>
          {{ receivable.status }}
        </p>
        <p>
          <span class="text-muted-foreground">
            {{ t('pages.expenseShare.receivable.due_date') }}:
          </span>
          {{ receivable.due_date || '—' }}
        </p>
      </div>
    </template>
    <template #footer>
      <div class="flex gap-2 justify-end w-full">
        <RouterLink
          to="/investments"
          class="text-sm text-sky-500 hover:underline self-center mr-auto"
        >
          {{ t('pages.expenseShare.receivable.go_investments') }}
        </RouterLink>
        <Button type="secondary" size="sm" @click="close">
          {{ t('pages.expenseShare.common.close') }}
        </Button>
      </div>
    </template>
  </Modal>
</template>
