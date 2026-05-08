<script lang="ts" setup>
import { format } from 'date-fns'
import { Edit } from 'lucide-vue-next'
import type { PropType } from 'vue'
import type { ReceivableAPIItem } from '~~/api/receivables'
import { patchReceivable } from '~~/api/receivables'
import Modal from '~~/components/Modal.vue'
import { useNotificationsStore } from '~~/stores/notifications'

const emits = defineEmits(['form-finished'])

const props = defineProps({
  receivable: {
    type: Object as PropType<ReceivableAPIItem>,
    required: true,
  },
})

const { t } = useLang()
const modal = ref<InstanceType<typeof Modal> | null>(null)
const notifications = useNotificationsStore()

const dueDefault = props.receivable.due_date
  ? new Date(props.receivable.due_date)
  : new Date()

const fields = [
  {
    key: 'description',
    title: t('pages.investments.receivables.form.description'),
    default: props.receivable.description ?? '',
    value: props.receivable.description ?? '',
  },
  {
    key: 'contact',
    title: t('pages.investments.receivables.form.contact'),
    default: props.receivable.contact ?? '',
    value: props.receivable.contact ?? '',
  },
  {
    key: 'due_date',
    title: t('pages.investments.receivables.form.due_date'),
    default: dueDefault,
    datePicker: true,
    value: dueDefault,
  },
]

const openModal = () => {
  modal.value?.open()
}

const closeModal = () => {
  modal.value?.close()
}

const submit = (data: Record<string, unknown>) => {
  const payload: Record<string, string> = {}
  if (typeof data.description === 'string') {
    payload.description = data.description.trim()
  }
  if (typeof data.contact === 'string') {
    payload.contact = data.contact.trim()
  }
  if (data.due_date instanceof Date) {
    payload.due_date = format(data.due_date, 'yyyy-MM-dd')
  }
  return patchReceivable(props.receivable.id, payload)
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
    <Edit class="text-lg cursor-pointer" @click="openModal" />
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
