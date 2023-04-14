<script lang="ts" setup>
import { createTransaction } from '~~/api/transactions'
import Modal from '~~/components/Modal.vue'
import { useAccounts } from '~~/stores/accounts'
import { useNotificationsStore } from '~~/stores/notifications'

const emits = defineEmits(['form-finished'])

// data
const { t } = useLang()
const modal = ref<InstanceType<typeof Modal> | null>(null)
const accountsState = useAccounts()
const accountsList = accountsState.getAccounts
const notifications = useNotificationsStore()

const fields = [
  {
    key: 'date',
    title: 'Date',
    default: new Date(),
    datePicker: true,
    value: '',
  },
  {
    key: 'account',
    title: 'Account',
    default: accountsList[0],
    selectOptions: accountsList,
    selectionKey: 'name',
    optionKey: 'name',
    value: '',
  },
  {
    key: 'description',
    title: 'Description',
    default: '',
    value: '',
  },
  {
    key: 'amount',
    title: 'Amount',
    default: 0,
    value: 0,
    componentProps: {
      type: 'number',
    },
  },
]

// methods
const openModal = () => {
  modal.value?.open()
}
const closeModal = () => {
  modal.value?.close()
}

const submit = (data: any) => {
  return createTransaction({
    ...data,
    account: data.account.id,
  })
}

const finishCreate = () => {
  notifications.addNotification({
    type: 'success',
    text: t('pages.summary.transactions.create.success'),
  })
  closeModal()
  emits('form-finished')
}
</script>

<template>
  <div>
    <Button @click="openModal">Create</Button>
    <Modal ref="modal">
      <template #contents>
        <Form
          class="m-auto max-w-1/3"
          :fields="fields"
          :form-submit-fn="submit"
          :form-title="`${t('pages.summary.transactions.create.title')}`"
          :restart-title="`${t('pages.summary.transactions.create.restart')}`"
          :submit-title="`${t('pages.summary.transactions.create.title')}`"
          @form-finished="() => finishCreate()"
        ></Form>
      </template>
    </Modal>
  </div>
</template>
