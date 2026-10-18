<script lang="ts" setup>
import { format } from 'date-fns'
import { createReceivable } from '@/api/receivables'
import Modal from '@/components/Modal.vue'
import { useNotificationsStore } from '@/stores/notifications'
import type { FormField } from '@/types/formTypes'

const emits = defineEmits(['form-finished'])

const { t } = useLang()
const modal = ref<InstanceType<typeof Modal> | null>(null)
const notifications = useNotificationsStore()

const fields = computed<FormField[]>(() => [
  {
    key: 'description',
    title: t('pages.investments.receivables.form.description'),
    default: '',
    value: '',
  },
  {
    key: 'contact',
    title: t('pages.investments.receivables.form.contact'),
    default: '',
    value: '',
  },
  {
    key: 'due_date',
    title: t('pages.investments.receivables.form.due_date'),
    default: new Date(),
    datePicker: true,
    value: new Date(),
  },
])

const openModal = () => {
  modal.value?.open()
}
const closeModal = () => {
  modal.value?.close()
}

const submit = (data: Record<string, unknown>) => {
  const payload: Record<string, string> = {}
  if (typeof data.description === 'string' && data.description.trim()) {
    payload.description = data.description.trim()
  }
  if (typeof data.contact === 'string' && data.contact.trim()) {
    payload.contact = data.contact.trim()
  }
  if (data.due_date instanceof Date) {
    payload.due_date = format(data.due_date, 'yyyy-MM-dd')
  }
  return createReceivable(payload)
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
          as-modal
          :fields="fields"
          :form-submit-fn="submit"
          :form-title="`${t('pages.investments.receivables.create.title')}`"
          :restart-title="`${t(
            'pages.investments.receivables.create.restart'
          )}`"
          :submit-title="`${t('pages.investments.receivables.create.title')}`"
          @form-finished="() => finishCreate()"
        >
          <template #form-contents>
            <p class="mt-3 text-sm text-muted-foreground">
              {{ t('pages.investments.receivables.create.manual_hint') }}
            </p>
          </template>
        </Form>
      </template>
    </Modal>
  </div>
</template>
