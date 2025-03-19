<script lang="ts" setup>
import { endOfMonth, format, startOfMonth } from 'date-fns'
import type { FormField } from '~~/types/formTypes'
import { createProductList } from '~~/api/products'
import Modal from '~~/components/Modal.vue'
import { useNotificationsStore } from '~~/stores/notifications'

const emits = defineEmits(['list-created'])

const { t } = useLang()
const notifications = useNotificationsStore()
const modal = ref<InstanceType<typeof Modal> | null>(null)

const listTypes = [
  {
    key: 'NO_PERIOD',
    title: t('pages.products.createList.noPeriod'),
  },
  {
    key: 'MONTHLY',
    title: t('pages.products.createList.monthly'),
  },
]

const fields = computed<FormField[]>(() => [
  {
    key: 'name',
    title: t('pages.products.createList.name'),
    value: '',
  },
  {
    key: 'description',
    title: t('pages.products.createList.description'),
    value: '',
  },
  {
    key: 'type',
    title: t('pages.products.createList.type'),
    selectOptions: listTypes,
    selectionKey: 'key',
    optionKey: 'title',
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
  const { name, description, type } = data

  // set period start first day of current month
  const periodStart =
    type === 'NO_PERIOD'
      ? undefined
      : format(startOfMonth(new Date()), 'yyyy-MM-dd')
  // set period end last day of current month
  const periodEnd =
    type === 'NO_PERIOD'
      ? undefined
      : format(endOfMonth(new Date()), 'yyyy-MM-dd')

  return createProductList({
    name,
    description,
    period_type: type.key,
    period_start: periodStart,
    period_end: periodEnd,
  })
    .then((response) => {
      emits('list-created', response)
      closeModal()
    })
    .catch((error) => {
      notifications.addNotification({
        type: 'error',
        text: error.message,
      })
    })
}

const finishCreate = () => {
  notifications.addNotification({
    type: 'success',
    text: t('pages.productsList.create.success'),
  })
}
</script>

<template>
  <div>
    <Button @click="openModal">
      {{ t('pages.products.createList.title') }}
    </Button>
    <Modal ref="modal">
      <template #contents>
        <Form
          as-modal
          :fields="fields"
          :form-submit-fn="submit"
          :form-title="`${t('pages.products.createList.title')}`"
          :restart-title="`${t('pages.products.createList.restart')}`"
          :submit-title="`${t('pages.products.createList.title')}`"
          @form-finished="() => finishCreate()"
        ></Form>
      </template>
    </Modal>
  </div>
</template>
