<script lang="ts" setup>
import type { PropType, Ref } from 'vue'
import { updateTransaction } from '~~/api/transactions'
import { useAccounts } from '~~/stores/accounts'
import type { DisplayTransaction } from '~~/types/transactionTypes'
import Modal from '~~/components/Modal.vue'
import { useNotificationsStore } from '~~/stores/notifications'
import { useTransactions } from '~~/stores/transactions'
import type { CategoryAPI } from '~~/types/categories'
import { FormField } from '~~/types/formTypes'

const emits = defineEmits(['form-finished'])

const props = defineProps({
  transaction: {
    type: Object as PropType<DisplayTransaction>,
    required: true,
  },
})

// data
const { t } = useLang()
const modal = ref<InstanceType<typeof Modal> | null>(null)
const accountsState = useAccounts()
const transactionsState = useTransactions()
const accountsList = accountsState.getAccounts
const notifications = useNotificationsStore()
const categories = computed(() => transactionsState.getCategories)

// methods

const openModal = () => {
  modal.value?.open()
}

const closeModal = () => {
  modal.value?.close()
}

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
        const amount = amountField.value
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
  },
]

const submit = (data: any) => {
  return updateTransaction(props.transaction.id, {
    ...data,
    account: data.account.id,
    category: data.category.id,
  })
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
    <IconMdi:pencil-box-outline
      class="text-xl cursor-pointer"
      @click="openModal"
    />
    <Modal ref="modal">
      <template #contents>
        <Form
          as-modal
          :fields="fields"
          :form-submit-fn="submit"
          :form-title="`${t('pages.summary.transactions.update.title')}`"
          :submit-title="`${t('pages.summary.transactions.update.title')}`"
          @form-finished="() => finish()"
        ></Form>
      </template>
    </Modal>
  </div>
</template>
