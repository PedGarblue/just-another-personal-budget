<script lang="ts" setup>
import { format } from 'date-fns'
import { createReport } from '~~/api/reports'
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

const datePickerFormat = (date: Date) => {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return `${year}-${month}-${day}`
}

const fields = computed<FormField[]>(() => [
  {
    key: 'from_date',
    title: 'Starting date',
    default: new Date(),
    datePicker: true,
    value: new Date(),
    componentProps: {
      modeltype: 'yyyy-mm-dd',
      format: datePickerFormat,
    },
  },
  {
    key: 'to_date',
    title: 'End date',
    default: new Date(),
    datePicker: true,
    value: new Date(),
    componentProps: {
      modeltype: 'yyyy-mm-dd',
      format: datePickerFormat,
    },
  },
  {
    key: 'account',
    title: 'Account',
    default: accountsState.getAccounts[0],
    selectOptions: accountsState.getAccounts,
    selectionKey: 'name',
    optionKey: 'name',
    value: '',
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
  return createReport({
    account: data.account.id,
    from_date: format(data.from_date, 'yyyy-MM-dd'),
    to_date: format(data.to_date, 'yyyy-MM-dd'),
  })
}

const finishCreate = () => {
  notifications.addNotification({
    type: 'success',
    text: t('pages.reports.create.success'),
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
          as-modal
          :fields="fields"
          :form-submit-fn="submit"
          :form-title="`${t('pages.reports.create.title')}`"
          :restart-title="`${t('pages.reports.create.restart')}`"
          :submit-title="`${t('pages.reports.create.title')}`"
          @form-finished="() => finishCreate()"
        ></Form>
      </template>
    </Modal>
  </div>
</template>
