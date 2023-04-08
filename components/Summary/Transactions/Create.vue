<script lang="ts" setup>
import VueDatePicker from '@vuepic/vue-datepicker'
import { createTransaction, TransactionBase } from '~~/api/transactions'
import Modal from '~~/components/Modal.vue'
import { AccountComplete, useAccounts } from '~~/stores/accounts'

enum LoadingStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  FINISHED = 'FINISHED',
  ERROR = 'ERROR',
}

const emits = defineEmits(['form-finished'])

// data
const { t } = useLang()
const modal = ref<InstanceType<typeof Modal> | null>(null)
const accountsState = useAccounts()
const accountsList = accountsState.getAccounts
const defaultData = {
  description: '',
  date: new Date(),
  account: 0,
  amount: '',
}
const transactionData = reactive({ ...defaultData })
const account = ref<AccountComplete>(accountsList[0])
const loadingState = ref<LoadingStatus>(LoadingStatus.IDLE)

// methods
const openModal = () => {
  modal.value?.open()
}
const closeModal = () => {
  modal.value?.close()
  clearForm()
}
const clearForm = () => {
  transactionData.description = defaultData.description
  transactionData.date = defaultData.date
  transactionData.account = defaultData.account
  transactionData.amount = defaultData.amount
  loadingState.value = LoadingStatus.IDLE
}

const addTransaction = async () => {
  if (loadingState.value !== LoadingStatus.IDLE) return
  const { description, amount, date } = transactionData
  const data: TransactionBase = {
    description,
    amount,
    date,
    account: account.value.id,
  }

  loadingState.value = LoadingStatus.LOADING

  try {
    const created = await createTransaction(data)
    loadingState.value = LoadingStatus.FINISHED
    emits('form-finished')
  } catch (error) {
    loadingState.value = LoadingStatus.ERROR
  }
}
</script>

<template>
  <div>
    <Button @click="openModal">Create</Button>
    <Modal ref="modal">
      <template #header>
        <h3>
          {{ t('pages.summary.transactions.create.title') }}
        </h3>
        {{ transactionData }}
      </template>
      <template #body>
        <template v-if="loadingState === LoadingStatus.LOADING">
          <div class="flex w-full h-full items-center justify-center p-16">
            <IconMdi:loading class="text-[5rem] animate-spin" />
          </div>
        </template>
        <template v-else-if="loadingState === LoadingStatus.FINISHED">
          <div class="flex w-full h-full items-center justify-center p-16">
            <IconMdi:checkbox-marked-circle
              class="text-[5rem] text-green-500"
            />
          </div>
        </template>
        <div v-else class="flex flex-col gap-2">
          <div>
            <div class="text-base">Date</div>
            <VueDatePicker v-model="transactionData.date" />
          </div>
          <Select v-model="account" :options="accountsList" title="Account">
            <template #selected-value="{ selected }">
              {{ selected ? selected.name : '' }}
            </template>
            <template #item-value="{ option }">
              {{ option.name }}
            </template>
          </Select>
          <FormTextInput
            v-model="transactionData.description"
            size="md"
            class="md:1/3"
            title="Description"
          />
          <FormTextInput
            v-model="transactionData.amount"
            type="number"
            size="md"
            class="md:1/3"
            title="Amount"
          >
            <template #prefix>
              {{ account.currencyData.name }}
            </template>
          </FormTextInput>
        </div>
      </template>
      <template #footer>
        <div
          v-if="loadingState === LoadingStatus.FINISHED"
          class="flex flex-row gap-6"
        >
          <Button @click="() => clearForm()">
            {{ t('pages.summary.transactions.create.restart') }}
          </Button>
          <Button @click="() => closeModal()">
            {{ t('others.close') }}
          </Button>
        </div>
        <Button v-else @click="addTransaction">{{
          t('pages.summary.transactions.create.title')
        }}</Button>
      </template>
    </Modal>
  </div>
</template>
