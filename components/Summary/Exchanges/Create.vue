<script lang="ts" setup>
import { createExchange } from '~~/api/exchanges'
import Modal from '~~/components/Modal.vue'
import { useAccounts } from '~~/stores/accounts'
import { useNotificationsStore } from '~~/stores/notifications'
import { FormField } from '~~/types/formTypes'

const emits = defineEmits(['form-finished'])

// data
const { t } = useLang()
const modal = ref<InstanceType<typeof Modal> | null>(null)
const accountsState = useAccounts()
const notifications = useNotificationsStore()

const fields = computed<FormField[]>(() => [
  {
    key: 'date',
    title: 'Date',
    default: new Date(),
    datePicker: true,
    value: '',
    componentProps: {
      required: true,
    },
  },
  {
    key: 'description',
    title: 'Description',
    default: '',
    value: '',
  },
  {
    key: 'from_account',
    title: 'Sender Account',
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
    key: 'from_amount',
    title: 'Sender Amount',
    default: 0,
    value: 0,
    componentProps: {
      type: 'number',
      required: true,
    },
  },
  {
    key: 'to_account',
    title: 'Recipient Account',
    default: accountsState.getAccounts[1],
    selectOptions: accountsState.getAccounts,
    selectionKey: 'name',
    optionKey: 'name',
    value: '',
    componentProps: {
      required: true,
    },
  },
  {
    key: 'to_amount',
    title: 'Recipient Amount',
    default: 0,
    value: 0,
    componentProps: {
      type: 'number',
      required: true,
    },
  },
])

// methods
const openModal = () => {
  modal.value?.open()
}
const closeModal = () => {
  modal.value?.close()
}
const submit = (data: any) => {
  return createExchange({
    ...data,
    from_account: data.from_account.id,
    to_account: data.to_account.id,
  })
}

const finishCreate = () => {
  notifications.addNotification({
    type: 'success',
    text: t('pages.summary.exchanges.create.success'),
  })
  closeModal()
  emits('form-finished')
}
</script>

<template>
  <div>
    <Button @click="openModal">{{
      t('pages.summary.exchanges.create.title')
    }}</Button>
    <Modal ref="modal">
      <template #contents>
        <Form
          class="m-auto max-w-1/3"
          :fields="fields"
          :form-submit-fn="submit"
          :form-title="t('pages.summary.exchanges.create.title')"
          :restart-title="t('pages.summary.exchanges.create.restart')"
          :submit-title="t('pages.summary.exchanges.create.title')"
          :close-title="t('others.close')"
          @form-finished="() => finishCreate()"
        ></Form>
      </template>
    </Modal>
  </div>
</template>
