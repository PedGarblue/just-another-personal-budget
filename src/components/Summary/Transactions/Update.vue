<script lang="ts" setup>
import { Edit } from 'lucide-vue-next'
import type { PropType } from 'vue'
import { updateTransaction } from '@/api/transactions'
import Modal from '@/components/Modal.vue'
import { useTransactionLoanReceivable } from '@/composables/useTransactionLoanReceivable'
import { useAccounts } from '@/stores/accounts'
import type { DisplayTransaction } from '@/types/transactionTypes'
import { useNotificationsStore } from '@/stores/notifications'
import { useTransactions } from '@/stores/transactions'
import type { FormField } from '@/types/formTypes'
import type { ProductAPI } from '@/types/products'

const emits = defineEmits(['form-finished'])

const props = defineProps({
  transaction: {
    type: Object as PropType<DisplayTransaction>,
    required: true,
  },
})

const { t } = useLang()
const modal = ref<InstanceType<typeof Modal> | null>(null)
const accountsState = useAccounts()
const transactionsState = useTransactions()
const accountsList = accountsState.getAccounts
const notifications = useNotificationsStore()
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
  prepareUpdateModalState,
  receivableOptionLabel,
  contactOptionLabel,
  validateLoanReceivableForm,
  buildTransactionBodyWithLoan,
} = useTransactionLoanReceivable()

const fields: FormField[] = [
  {
    key: 'description',
    title: t('transactions.create.form.description'),
    default: props.transaction.description,
    value: props.transaction.description,
  },
  {
    key: 'date',
    title: t('transactions.create.form.date'),
    default: props.transaction.date,
    datePicker: true,
    value: props.transaction.date,
  },
  {
    key: 'account',
    title: t('transactions.create.form.account'),
    default: props.transaction.accountData,
    selectOptions: accountsList,
    selectionKey: 'name',
    optionKey: 'name',
    value: props.transaction.accountData,
  },
  {
    key: 'amount',
    title: t('transactions.create.form.amount'),
    default: props.transaction.amount,
    value: props.transaction.amount,
    componentProps: {
      type: 'number',
      required: true,
      step: '0.01',
    },
  },
  {
    key: 'category',
    title: t('transactions.create.form.category'),
    default: props.transaction.categoryData,
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
    value: props.transaction.categoryData,
    componentProps: {
      required: false,
    },
  },
]

const transactionItems = ref<ProductAPI[]>([])

const openModal = async () => {
  await loadLoanReceivableOptions()
  prepareUpdateModalState(
    props.transaction.amount,
    props.transaction.receivable,
    props.transaction.contact
  )
  modal.value?.open()
}

const closeModal = () => {
  modal.value?.close()
}

const submit = (data: any) => {
  const amount = Number(data.amount)
  validateLoanReceivableForm(data, amount)
  const body = buildTransactionBodyWithLoan(data, amount)
  return updateTransaction(props.transaction.id, body, transactionItems.value)
}

const finish = () => {
  notifications.addNotification({
    type: 'success',
    text: t('pages.summary.transactions.update.success'),
  })
  closeModal()
  emits('form-finished')
}
</script>

<template>
  <div>
    <Edit class="text-xl cursor-pointer" @click="openModal" />
    <Modal ref="modal">
      <template #contents>
        <Form
          as-modal
          :fields="fields"
          :form-submit-fn="submit"
          :form-title="`${t('pages.summary.transactions.update.title')}`"
          :submit-title="`${t('pages.summary.transactions.update.title')}`"
          @form-finished="() => finish()"
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
              collection-contact-select-id="update-collection-contact"
              collection-receivable-select-id="update-collection-receivable"
              loan-contact-input-id="update-loan-contact-input"
            />
            <div class="mt-4">
              <SummaryTransactionsTransactionItemsPicker
                v-model="transactionItems"
                :default-products="props.transaction.transaction_items"
              />
            </div>
          </template>
        </Form>
      </template>
    </Modal>
  </div>
</template>
