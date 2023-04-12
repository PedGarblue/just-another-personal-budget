<script lang="ts" setup>
import { PropType } from 'vue'
import { updateTransaction } from '~~/api/transactions'
import { useAccounts } from '~~/stores/accounts'
import { DisplayTransaction } from '~~/types/transactionTypes'
import Modal from '~~/components/Modal.vue'

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
const accountsList = accountsState.getAccounts

// methods

const openModal = () => {
  modal.value?.open()
}

const closeModal = () => {
  modal.value?.close()
}

const fields = [
  {
    key: 'date',
    title: 'Date',
    default: props.transaction.date,
    datePicker: true,
    value: props.transaction.date,
  },
  {
    key: 'account',
    title: 'Account',
    default: props.transaction.accountData,
    selectOptions: accountsList,
    selectionKey: 'name',
    optionKey: 'name',
    value: props.transaction.accountData,
  },
  {
    key: 'description',
    title: 'Description',
    default: props.transaction.description,
    value: props.transaction.description,
  },
  {
    key: 'amount',
    title: 'Amount',
    default: props.transaction.amount,
    value: props.transaction.amount,
    componentProps: {
      type: 'number',
    },
  },
]

const submit = (data: any) => {
  return updateTransaction(props.transaction.id, {
    ...data,
    account: data.account.id,
  })
}

const finish = () => {
  closeModal()
  emits('form-finished')
}
</script>

<template>
  <div>
    <IconMdi:pencil-box-outline
      class="text-lg cursor-pointer"
      @click="openModal"
    />
    <Modal ref="modal">
      <template #contents>
        <Form
          class="m-auto max-w-1/3"
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
