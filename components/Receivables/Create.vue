<script lang="ts" setup>
import { format } from 'date-fns'
import { createReceivable } from '~~/api/receivables'
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
    key: 'description',
    title: 'Description',
    value: '',
  },
  {
    key: 'amount_given',
    title: 'Amount Given',
    value: 0,
    componentProps: {
      type: 'number',
    },
  },
  {
    key: 'amount_to_receive',
    title: 'Amount to Receive',
    value: 0,
    componentProps: {
      type: 'number',
    },
  },
  {
    key: 'amount_paid',
    title: 'Amount Paid',
    value: 0,
    componentProps: {
      type: 'number',
    },
  },
  {
    key: 'status',
    title: 'Status',
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
    key: 'contact',
    title: 'Contact',
    value: '',
  },
  {
    key: 'due_date',
    title: 'Due date',
    default: new Date(),
    datePicker: true,
    value: new Date(),
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
  return createReceivable({
    ...data,
    account: data.account.id,
    due_date: format(data.due_date, 'yyyy-mm-dd'),
  })
}

const finishCreate = () => {
  notifications.addNotification({
    type: 'success',
    text: t('pages.investments.receivables.create.success'),
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
          :form-title="`${t('pages.investments.receivables.create.title')}`"
          :restart-title="`${t(
            'pages.investments.receivables.create.restart'
          )}`"
          :submit-title="`${t('pages.investments.receivables.create.title')}`"
          @form-finished="() => finishCreate()"
        ></Form>
      </template>
    </Modal>
  </div>
</template>
