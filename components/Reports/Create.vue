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

  return `${year}-${month}`
}

const fields = computed<FormField[]>(() => [
  {
    key: 'month',
    title: 'Month',
    default: new Date(),
    datePicker: true,
    value: new Date(),
    componentProps: {
      modeltype: 'yyyy-MM',
      format: datePickerFormat,
      enableTimePicker: false,
      monthPicker: true,
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
  const { account, month: date } = data
  const monthDate = new Date(date.year, date.month)
  const monthWithFirstDay = format(
    new Date(monthDate.getFullYear(), monthDate.getMonth(), 1),
    'yyyy-MM-dd'
  )

  const monthWithLastDay = format(
    new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0),
    'yyyy-MM-dd'
  )

  return createReport({
    account: account.id,
    from_date: monthWithFirstDay,
    to_date: monthWithLastDay,
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
