<script lang="ts" setup>
import { Plus } from 'lucide-vue-next'
import { onMounted, onUnmounted } from 'vue'
import { createTransaction } from '~~/api/transactions'
import Modal from '~~/components/Modal.vue'
import { useTransactionLoanReceivable } from '~~/composables/useTransactionLoanReceivable'
import { useAccounts } from '~~/stores/accounts'
import { useNotificationsStore } from '~~/stores/notifications'
import { useTransactions } from '~~/stores/transactions'
import type { FormField } from '~~/types/formTypes'
import type { ProductAPI } from '~~/types/products'

const emits = defineEmits(['form-finished'])

const { t } = useLang()
const modal = ref<InstanceType<typeof Modal> | null>(null)
const accountsState = useAccounts()
const notifications = useNotificationsStore()
const transactionsState = useTransactions()
const categories = computed(() => transactionsState.getCategories)

const {
  isLoan,
  loanContact,
  loanDueDate,
  collectionContactName,
  collectionReceivableId,
  contactRows,
  receivableRows,
  advancedLoanReceivableOpen,
  loadLoanReceivableOptions,
  resetLoanCollectionUi,
  receivableOptionLabel,
  contactOptionLabel,
  validateLoanReceivableForm,
  buildTransactionBodyWithLoan,
} = useTransactionLoanReceivable()

const lastCreatedCount = ref(0)

const fields = computed<FormField[]>(() => [
  {
    key: 'description',
    title: t('transactions.create.form.description'),
    default: '',
    value: '',
    componentProps: {},
  },
  {
    key: 'date',
    title: t('transactions.create.form.date'),
    default: new Date(),
    datePicker: true,
    value: '',
  },
  {
    key: 'account',
    title: t('transactions.create.form.account'),
    default: accountsState.getAccounts[0],
    selectOptions: accountsState.getAccounts,
    selectionKey: 'name',
    optionKey: 'name',
    value: '',
    componentProps: {
      required: true,
    },
  },
  {
    key: 'amount',
    title: t('transactions.create.form.amount'),
    default: 0,
    value: 0,
    componentProps: {
      type: 'number',
      required: true,
      step: '0.01',
    },
  },
  {
    key: 'category',
    title: t('transactions.create.form.category'),
    default: categories.value[0],
    selectOptions: categories.value,
    selectOptionsMutator: (options, fields) => {
      const amountField = fields.find((field) => field.key === 'amount')
      if (amountField) {
        const amount = Number(amountField.value)
        return options.filter((option) => {
          if (typeof option === 'object' && 'type' in option) {
            return amount > 0
              ? option.type === 'income'
              : option.type === 'expense'
          }
          return false
        })
      }
      return options
    },
    selectionKey: 'name',
    optionKey: 'name',
    value: '',
    componentProps: {
      required: false,
    },
  },
])

const transactionItems = ref<ProductAPI[]>([])

const openModal = async () => {
  resetLoanCollectionUi()
  await loadLoanReceivableOptions()
  modal.value?.open()
}

const closeModal = () => {
  modal.value?.close()
}

const submit = async (data: any) => {
  const amount = Number(data.amount)
  validateLoanReceivableForm(data, amount)
  const body = buildTransactionBodyWithLoan(data, amount)
  const created = await createTransaction(body, transactionItems.value)
  lastCreatedCount.value = created.length
  return created
}

const finishCreate = () => {
  const count = lastCreatedCount.value
  const text =
    collectionContactName.value && count > 1
      ? t('transactions.loan.collection_multi_success', { count })
      : t('pages.summary.transactions.create.success')
  notifications.addNotification({
    type: 'success',
    text,
  })
  resetLoanCollectionUi()
  closeModal()
  emits('form-finished')
}

const handleKeybind = (e: KeyboardEvent) => {
  if (e.altKey && (e.key === 't' || e.key === 'T')) {
    openModal()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeybind)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeybind)
})
</script>

<template>
  <div>
    <Button @click="openModal">
      <Plus class="mr-1 text-lg" />
      {{ t('pages.summary.transactions.create.title') }}
    </Button>
    <Modal ref="modal">
      <template #contents>
        <Form
          as-modal
          :fields="fields"
          :form-submit-fn="submit"
          :form-title="`${t('pages.summary.transactions.create.title')}`"
          :restart-title="`${t('pages.summary.transactions.create.restart')}`"
          :submit-title="`${t('pages.summary.transactions.create.title')}`"
          @form-finished="() => finishCreate()"
        >
          <template #form-contents>
            <SummaryTransactionsLoanReceivableFields
              v-model:advanced-open="advancedLoanReceivableOpen"
              v-model:is-loan="isLoan"
              v-model:loan-contact="loanContact"
              v-model:loan-due-date="loanDueDate"
              v-model:collection-contact-name="collectionContactName"
              v-model:collection-receivable-id="collectionReceivableId"
              :contact-rows="contactRows"
              :receivable-rows="receivableRows"
              :receivable-option-label="receivableOptionLabel"
              :contact-option-label="contactOptionLabel"
              collection-contact-select-id="collection-contact-select"
              collection-receivable-select-id="collection-receivable-select"
              loan-contact-input-id="loan-contact-input"
            />
            <div class="mt-4">
              <SummaryTransactionsTransactionItemsPicker
                v-model="transactionItems"
              />
            </div>
          </template>
        </Form>
      </template>
    </Modal>
  </div>
</template>
