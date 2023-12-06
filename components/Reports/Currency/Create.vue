<script lang="ts" setup>
import { format } from 'date-fns'
import { createReportByCurrency } from '~~/api/reports/currency'
import Modal from '~~/components/Modal.vue'
import { useAccounts } from '~~/stores/accounts'
import { useNotificationsStore } from '~~/stores/notifications'
import { FormField } from '~~/types/formTypes'

const emits = defineEmits(['form-finished'])

// props

const props = defineProps({
  currency: {
    type: String,
    required: false,
    default: '',
  },
})

// data
const { t } = useLang()
const modal = ref<InstanceType<typeof Modal> | null>(null)
const accountsState = useAccounts()
const notifications = useNotificationsStore()
const currencies = computed(() => accountsState.getCurrencies)

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
    key: 'currency',
    title: 'Currency',
    default: accountsState.getCurrencies.find(
      (currency) => currency.name === props.currency
    ),
    selectOptions: currencies.value,
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

const datePickerFormat = (date: Date) => {
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return `${year}-${month}`
}

const submit = (data: any) => {
  const { currency, month: date } = data
  const monthDate =
    date instanceof Date ? date : new Date(date.year, date.month)
  const monthWithFirstDay = format(
    new Date(monthDate.getFullYear(), monthDate.getMonth(), 1),
    'yyyy-MM-dd'
  )

  const monthWithLastDay = format(
    new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0),
    'yyyy-MM-dd'
  )

  return createReportByCurrency({
    currency: currency.id,
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
