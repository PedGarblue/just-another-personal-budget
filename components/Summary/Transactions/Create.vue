<script lang="ts" setup>
import { Ref } from 'vue'
import { createTransaction } from '~~/api/transactions'
import Modal from '~~/components/Modal.vue'
import { useAccounts } from '~~/stores/accounts'
import { useNotificationsStore } from '~~/stores/notifications'
import { FormField } from '~~/types/formTypes'
import { CategoryAPI } from '~~/types/categories'

const emits = defineEmits(['form-finished'])

// data
const { t } = useLang()
const modal = ref<InstanceType<typeof Modal> | null>(null)
const accountsState = useAccounts()
const notifications = useNotificationsStore()
const categories = inject<Ref<CategoryAPI[]>>('categories')

const fields = computed<FormField[]>(() => [
  {
    key: 'date',
    title: 'Date',
    default: new Date(),
    datePicker: true,
    value: '',
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
  {
    key: 'category',
    title: 'Category',
    default: categories?.value[0],
    selectOptions: categories?.value,
    selectionKey: 'name',
    optionKey: 'name',
    value: '',
  },
  {
    key: 'description',
    title: 'Description',
    default: '',
    value: '',
  },
  {
    key: 'amount',
    title: 'Amount',
    default: 0,
    value: 0,
    componentProps: {
      type: 'number',
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
  return createTransaction({
    ...data,
    account: data.account.id,
    category: data.category.id,
  })
}

const finishCreate = () => {
  notifications.addNotification({
    type: 'success',
    text: t('pages.summary.transactions.create.success'),
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
          :form-title="`${t('pages.summary.transactions.create.title')}`"
          :restart-title="`${t('pages.summary.transactions.create.restart')}`"
          :submit-title="`${t('pages.summary.transactions.create.title')}`"
          @form-finished="() => finishCreate()"
        ></Form>
      </template>
    </Modal>
  </div>
</template>
