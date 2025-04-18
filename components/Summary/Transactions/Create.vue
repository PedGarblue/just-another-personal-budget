<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import { createTransaction } from '~~/api/transactions'
import Modal from '~~/components/Modal.vue'
import { useAccounts } from '~~/stores/accounts'
import { useTransactions } from '~~/stores/transactions'
import { useNotificationsStore } from '~~/stores/notifications'
import type { FormField } from '~~/types/formTypes'
import type { ProductAPI } from '~~/types/products'

const emits = defineEmits(['form-finished'])

// data
const { t } = useLang()
const modal = ref<InstanceType<typeof Modal> | null>(null)
const accountsState = useAccounts()
const transactionsState = useTransactions()
const notifications = useNotificationsStore()
const categories = computed(() => transactionsState.getCategories)

const fields = computed<FormField[]>(() => [
  {
    key: 'description',
    title: t('transactions.create.form.description'),
    default: '',
    value: '',
    componentProps: {},
  },
  {
    key: 'date',
    title: t('transactions.create.form.date'),
    default: new Date(),
    datePicker: true,
    value: '',
  },
  {
    key: 'account',
    title: t('transactions.create.form.account'),
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
    key: 'amount',
    title: t('transactions.create.form.amount'),
    default: 0,
    value: 0,
    componentProps: {
      type: 'number',
      required: true,
      step: '0.01',
    },
  },
  {
    key: 'category',
    title: t('transactions.create.form.category'),
    default: categories.value[0],
    selectOptions: categories.value,
    selectOptionsMutator: (options, fields) => {
      const amountField = fields.find((field) => field.key === 'amount')
      if (amountField) {
        const amount = amountField.value
        return options.filter((option) => {
          if (typeof option === 'object' && 'type' in option) {
            return amount > 0
              ? option.type === 'income'
              : option.type === 'expense'
          }
          return false
        })
      }
      return options
    },
    selectionKey: 'name',
    optionKey: 'name',
    value: '',
    componentProps: {
      required: true,
    },
  },
])

const transactionItems = ref<ProductAPI[]>([])

// methods
const openModal = () => {
  modal.value?.open()
}
const closeModal = () => {
  modal.value?.close()
}

const submit = (data: any) => {
  return createTransaction(
    {
      ...data,
      account: data.account.id,
      category: data.category.id,
    },
    transactionItems.value
  )
}

const finishCreate = () => {
  notifications.addNotification({
    type: 'success',
    text: t('pages.summary.transactions.create.success'),
  })
  closeModal()
  emits('form-finished')
}

const handleKeybind = (e: KeyboardEvent) => {
  if (e.altKey && (e.key === 't' || e.key === 'T')) {
    openModal()
  }
}

// Add keyboard event listener
onMounted(() => {
  window.addEventListener('keydown', handleKeybind)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeybind)
})
</script>

<template>
  <div>
    <Button @click="openModal">
      <IconMdi:cashPlus class="mr-1 text-lg" />
      {{ t('pages.summary.transactions.create.title') }}
    </Button>
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
        >
          <template #form-contents>
            <div class="mt-4">
              <SummaryTransactionsTransactionItemsPicker
                v-model="transactionItems"
              />
            </div>
          </template>
        </Form>
      </template>
    </Modal>
  </div>
</template>
