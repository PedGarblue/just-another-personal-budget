<script lang="ts" setup>
import type { PropType } from 'vue'
import { createTransactionGroup } from '~~/api/transactions'
import Modal from '~~/components/Modal.vue'
import { useNotificationsStore } from '~~/stores/notifications'
import type { FormField } from '~~/types/formTypes'

const emits = defineEmits(['form-finished'])

const props = defineProps({
  transactionIds: {
    type: Array as PropType<number[]>,
    required: true,
  },
})

const { t } = useLang()
const modal = ref<InstanceType<typeof Modal> | null>(null)
const notifications = useNotificationsStore()

const fields = computed<FormField[]>(() => [
  {
    key: 'name',
    title: t('pages.summary.transactions.group.create.form.name'),
    default: '',
    value: '',
    componentProps: {
      required: true,
    },
  },
  {
    key: 'date',
    title: t('pages.summary.transactions.group.create.form.date'),
    default: '',
    datePicker: true,
    value: '',
  },
])

const openModal = () => {
  modal.value?.open()
}

const closeModal = () => {
  modal.value?.close()
}

function toIsoDate(dateVal: unknown): string | undefined {
  if (dateVal instanceof Date && !Number.isNaN(dateVal.getTime())) {
    return dateVal.toISOString()
  }
  if (typeof dateVal === 'string' && dateVal.trim()) {
    const parsed = new Date(dateVal)
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString()
  }
  return undefined
}

const submit = async (data: Record<string, unknown>) => {
  const name = typeof data.name === 'string' ? data.name.trim() : ''
  if (!name) {
    throw new Error(
      t('pages.summary.transactions.group.create.errors.name_required')
    )
  }
  if (props.transactionIds.length < 2) {
    throw new Error(
      t('pages.summary.transactions.group.create.errors.min_transactions')
    )
  }
  const date = toIsoDate(data.date)
  return await createTransactionGroup({
    group: true,
    name,
    transactions: props.transactionIds,
    ...(date ? { date } : {}),
  })
}

const finishCreate = () => {
  notifications.addNotification({
    type: 'success',
    text: t('pages.summary.transactions.group.create.success'),
  })
  closeModal()
  emits('form-finished')
}

defineExpose({
  open: openModal,
})
</script>

<template>
  <Modal ref="modal">
    <template #contents>
      <Form
        as-modal
        :fields="fields"
        :form-submit-fn="submit"
        :form-title="t('pages.summary.transactions.group.create.title')"
        :restart-title="t('pages.summary.transactions.group.create.restart')"
        :submit-title="t('pages.summary.transactions.group.create.submit')"
        @form-finished="() => finishCreate()"
      >
        <template #form-contents>
          <p class="mt-3 text-sm text-muted-foreground">
            {{
              t('pages.summary.transactions.group.create.hint', {
                count: transactionIds.length,
              })
            }}
          </p>
        </template>
      </Form>
    </template>
  </Modal>
</template>
