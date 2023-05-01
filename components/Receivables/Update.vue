<script lang="ts" setup>
import { PropType } from 'vue'
import { useAccounts } from '~~/stores/accounts'
import Modal from '~~/components/Modal.vue'
import { useNotificationsStore } from '~~/stores/notifications'
import { ReceivableAPIItem, patchReceivable } from '~~/api/receivables'

const emits = defineEmits(['form-finished'])

const props = defineProps({
  receivable: {
    type: Object as PropType<ReceivableAPIItem>,
    required: true,
  },
})

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
    default: props.receivable.description,
    value: props.receivable.description,
  },
  {
    key: 'amount_given',
    title: 'Amount Given',
    default: props.receivable.amount_given,
    value: props.receivable.amount_given,
    componentProps: {
      type: 'number',
    },
  },
  {
    key: 'amount_to_receive',
    title: 'Amount to Receive',
    default: props.receivable.amount_to_receive,
    value: props.receivable.amount_to_receive,
    componentProps: {
      type: 'number',
    },
  },
  {
    key: 'amount_paid',
    title: 'Amount Paid',
    default: props.receivable.amount_paid,
    value: props.receivable.amount_paid,
    componentProps: {
      type: 'number',
    },
  },
  {
    key: 'status',
    title: 'Status',
    default: props.receivable.status,
    value: props.receivable.status,
  },
  {
    key: 'contact',
    title: 'Contact',
    default: props.receivable.contact,
    value: props.receivable.contact,
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
  return patchReceivable(props.receivable.id, {
    ...data,
  })
}

const finish = () => {
  notifications.addNotification({
    type: 'success',
    text: t('pages.investments.receivables.update.success'),
  })
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
          :form-title="`${t('pages.investments.receivables.update.title')}`"
          :submit-title="`${t('pages.investments.receivables.update.title')}`"
          @form-finished="() => finish()"
        ></Form>
      </template>
    </Modal>
  </div>
</template>
