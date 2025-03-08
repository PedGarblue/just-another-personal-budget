<script lang="ts" setup>
import { PropType } from 'vue'
import { twMerge } from 'tailwind-merge'
import { createAccount } from '~~/api/accounts'
import { Currency } from '~~/api/currencies'
import { createTransaction } from '~~/api/transactions'
import Modal from '~~/components/Modal.vue'
import { useAccounts } from '~~/stores/accounts'
import { useNotificationsStore } from '~~/stores/notifications'
import type { FormField } from '~~/types/formTypes'

const emits = defineEmits(['form-finished'])

const props = defineProps({
  currency: {
    type: Object as PropType<Currency | null>,
    required: false,
    default: () => ({}),
  },
  buttonClass: {
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

const defaultCurrency = computed(() =>
  accountsState.getCurrencies.find((c) => c.id === props.currency?.id)
)

const fields = computed<FormField[]>(() => [
  {
    key: 'currency',
    title: t('pages.summary.accounts.create.fields.currency.label'),
    default: defaultCurrency.value || accountsState.getCurrencies[0],
    selectOptions: accountsState.getCurrencies,
    selectionKey: 'name',
    optionKey: 'name',
    value: '',
  },
  {
    key: 'name',
    title: t('pages.summary.accounts.create.fields.name.label'),
    default: '',
    value: '',
  },
  {
    key: 'amount',
    title: t('pages.summary.accounts.create.fields.amount.label'),
    default: '0',
    value: '0',
    componentProps: {
      type: 'number',
    },
  },
  {
    key: 'date',
    title: t('pages.summary.accounts.create.fields.date.label'),
    description: t('pages.summary.accounts.create.fields.date.description'),
    default: new Date(),
    datePicker: true,
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

const submit = async (data: any) => {
  const account = await createAccount({
    ...data,
    currency: data.currency.id,
  })
  if (account) {
    await createTransaction({
      account: account.id,
      amount: data.amount,
      date: data.date,
      description: data.name,
    })
  }
}

const finishCreate = () => {
  notifications.addNotification({
    type: 'success',
    text: t('pages.summary.accounts.create.success'),
  })
  closeModal()
  emits('form-finished')
}
</script>

<template>
  <div>
    <button :class="twMerge('w-full', buttonClass)" @click="openModal">
      <slot name="button"></slot>
    </button>
    <Modal ref="modal">
      <template #contents>
        <Form
          as-modal
          :fields="fields"
          :form-submit-fn="submit"
          :form-title="`${t('pages.summary.accounts.create.title')}`"
          :restart-title="`${t('pages.summary.accounts.create.restart')}`"
          :submit-title="`${t('pages.summary.accounts.create.title')}`"
          @form-finished="() => finishCreate()"
        ></Form>
      </template>
    </Modal>
  </div>
</template>
